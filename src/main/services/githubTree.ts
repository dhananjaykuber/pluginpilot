import { createHash } from 'node:crypto'
import { dirname, basename } from 'node:path/posix'
import type { Octokit } from '@octokit/rest'
import { mapWithConcurrency } from './concurrency'
import { readDirectory } from './githubContent'
import type { PluginFile } from './pluginZip'

type Repository = {
  owner: string
  repo: string
}

type TreeEntry = {
  path: string
  mode: '100644'
  type: 'blob'
  sha?: string | null
  content?: string
}

type FolderReplacement = Repository & {
  baseBranch: string
  folderPath: string
  files: PluginFile[]
  message: string
}

type TextFileChanges = Repository & {
  baseBranch: string
  files: { path: string; content: string }[]
  message: string
}

// Keeps each create-tree request small enough for GitHub to finish before its ~10s timeout.
const MAX_BATCH_ENTRIES = 100
const MAX_BATCH_BYTES = 1024 * 1024
const BLOB_CONCURRENCY = 8
const MAX_ATTEMPTS = 3

// Creates a commit on top of `baseBranch` where `folderPath` contains exactly `files`.
// Only files that changed are sent, and files missing from `files` are deleted.
export async function commitFolderReplacement(
  octokit: Octokit,
  replacement: FolderReplacement
): Promise<string> {
  const { owner, repo, baseBranch, folderPath, files, message } = replacement
  const existingFiles = await listFolderFiles(octokit, { owner, repo }, baseBranch, folderPath)
  const entries = await buildTreeEntries(octokit, { owner, repo }, folderPath, files, existingFiles)

  if (entries.length === 0) {
    throw new Error(
      'The plugin folder already matches this version, so there is nothing to update.'
    )
  }

  return commitTreeEntries(octokit, { owner, repo }, baseBranch, entries, message)
}

// Creates a commit on top of `baseBranch` that writes the given text files.
export function commitTextFiles(octokit: Octokit, changes: TextFileChanges): Promise<string> {
  const { owner, repo, baseBranch, files, message } = changes
  const entries: TreeEntry[] = files.map(({ path, content }) => ({
    path,
    mode: '100644',
    type: 'blob',
    content
  }))

  return commitTreeEntries(octokit, { owner, repo }, baseBranch, entries, message)
}

async function commitTreeEntries(
  octokit: Octokit,
  repository: Repository,
  baseBranch: string,
  entries: TreeEntry[],
  message: string
): Promise<string> {
  const { data: branch } = await octokit.rest.repos.getBranch({ ...repository, branch: baseBranch })
  const treeSha = await createTreeInBatches(
    octokit,
    repository,
    branch.commit.commit.tree.sha,
    entries
  )

  const { data: commit } = await octokit.rest.git.createCommit({
    ...repository,
    message,
    tree: treeSha,
    parents: [branch.commit.sha]
  })

  return commit.sha
}

// Maps each file path in the folder to its blob SHA.
export async function listFolderFiles(
  octokit: Octokit,
  repository: Repository,
  ref: string,
  folderPath: string
): Promise<Map<string, string>> {
  const parentEntries = await readDirectory(octokit, { ...repository, ref }, dirname(folderPath))
  const folder = parentEntries?.find((entry) => entry.name === basename(folderPath))

  if (!folder || folder.type !== 'dir' || !('sha' in folder)) {
    return new Map()
  }

  const { data: tree } = await octokit.rest.git.getTree({
    ...repository,
    tree_sha: folder.sha as string,
    recursive: 'true'
  })

  if (tree.truncated) {
    throw new Error(`${folderPath} has too many files to update through the GitHub API.`)
  }

  return new Map(
    tree.tree
      .filter((entry) => entry.type === 'blob' && entry.path && entry.sha)
      .map((entry) => [`${folderPath}/${entry.path}`, entry.sha as string])
  )
}

async function buildTreeEntries(
  octokit: Octokit,
  repository: Repository,
  folderPath: string,
  files: PluginFile[],
  existingFiles: Map<string, string>
): Promise<TreeEntry[]> {
  const changedFiles = files.filter(
    (file) => existingFiles.get(`${folderPath}/${file.path}`) !== getGitBlobSha(file.content)
  )

  const updatedEntries = await mapWithConcurrency(changedFiles, BLOB_CONCURRENCY, (file) =>
    toTreeEntry(octokit, repository, `${folderPath}/${file.path}`, file.content)
  )

  const newPaths = new Set(files.map((file) => `${folderPath}/${file.path}`))
  const deletedEntries: TreeEntry[] = [...existingFiles.keys()]
    .filter((path) => !newPaths.has(path))
    .map((path) => ({ path, mode: '100644', type: 'blob', sha: null }))

  return [...updatedEntries, ...deletedEntries]
}

// Text files are sent inline in the tree; binary files need their own blob first.
async function toTreeEntry(
  octokit: Octokit,
  repository: Repository,
  path: string,
  content: Buffer
): Promise<TreeEntry> {
  const text = decodeUtf8Text(content)

  if (text !== null) {
    return { path, mode: '100644', type: 'blob', content: text }
  }

  const { data: blob } = await retryOnConnectionError(() =>
    octokit.rest.git.createBlob({
      ...repository,
      content: content.toString('base64'),
      encoding: 'base64'
    })
  )

  return { path, mode: '100644', type: 'blob', sha: blob.sha }
}

async function createTreeInBatches(
  octokit: Octokit,
  repository: Repository,
  baseTreeSha: string,
  entries: TreeEntry[]
): Promise<string> {
  let treeSha = baseTreeSha

  for (const batch of splitIntoBatches(entries)) {
    treeSha = await createTree(octokit, repository, treeSha, batch)
  }

  return treeSha
}

// When the request still times out or the connection drops, the batch is split in half and
// each half is sent on its own. A single entry is retried a few times instead.
async function createTree(
  octokit: Octokit,
  repository: Repository,
  baseTreeSha: string,
  entries: TreeEntry[]
): Promise<string> {
  const request = async (): Promise<string> => {
    const { data: tree } = await octokit.rest.git.createTree({
      ...repository,
      base_tree: baseTreeSha,
      tree: entries
    })
    return tree.sha
  }

  if (entries.length < 2) {
    return retryOnConnectionError(request)
  }

  try {
    return await request()
  } catch (error) {
    if (!isConnectionError(error)) {
      throw error
    }

    const middle = Math.ceil(entries.length / 2)
    const firstHalfSha = await createTree(
      octokit,
      repository,
      baseTreeSha,
      entries.slice(0, middle)
    )
    return createTree(octokit, repository, firstHalfSha, entries.slice(middle))
  }
}

async function retryOnConnectionError<T>(task: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await task()
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS || !isConnectionError(error)) {
        throw error
      }
    }
  }
}

// GitHub answers that it timed out, the connection drops before it answers (Octokit reports
// that as a 500 such as "read ETIMEDOUT"), or the connection drops while the request is still
// being sent, so GitHub only receives part of it and calls it malformed.
function isConnectionError(error: unknown): boolean {
  const status = (error as { status?: number }).status
  return (
    status === 502 ||
    status === 504 ||
    /timed out|ETIMEDOUT|ECONNRESET|socket hang up|malformed request/i.test(String(error))
  )
}

function splitIntoBatches(entries: TreeEntry[]): TreeEntry[][] {
  const batches: TreeEntry[][] = []
  let batch: TreeEntry[] = []
  let batchBytes = 0

  for (const entry of entries) {
    const entryBytes = entry.content ? Buffer.byteLength(entry.content) : 0

    if (batch.length >= MAX_BATCH_ENTRIES || batchBytes + entryBytes > MAX_BATCH_BYTES) {
      batches.push(batch)
      batch = []
      batchBytes = 0
    }

    batch.push(entry)
    batchBytes += entryBytes
  }

  return batch.length > 0 ? [...batches, batch] : batches
}

// Git identifies file contents by the SHA-1 of "blob <size>\0<content>".
export function getGitBlobSha(content: Buffer): string {
  return createHash('sha1').update(`blob ${content.length}\0`).update(content).digest('hex')
}

const utf8Decoder = new TextDecoder('utf-8', { fatal: true })

function decodeUtf8Text(content: Buffer): string | null {
  if (content.includes(0)) {
    return null
  }

  try {
    return utf8Decoder.decode(content)
  } catch {
    return null
  }
}
