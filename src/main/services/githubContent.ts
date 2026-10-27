import type { Octokit } from '@octokit/rest'
import { isNotFoundError } from './github'

export type RepositoryRef = {
  owner: string
  repo: string
  ref: string
}

export type DirectoryEntry = {
  name: string
  path: string
  type: string
}

// Returns null when the path doesn't exist or isn't a directory.
export async function readDirectory(
  octokit: Octokit,
  location: RepositoryRef,
  path: string
): Promise<DirectoryEntry[] | null> {
  try {
    const { data } = await octokit.rest.repos.getContent({ ...location, path })
    return Array.isArray(data) ? data : null
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }

    throw error
  }
}

// Returns null when the path doesn't exist or isn't a file.
export async function readTextFile(
  octokit: Octokit,
  location: RepositoryRef,
  path: string
): Promise<string | null> {
  try {
    const { data } = await octokit.rest.repos.getContent({ ...location, path })

    if (Array.isArray(data) || data.type !== 'file' || !('content' in data)) {
      return null
    }

    return Buffer.from(data.content, 'base64').toString('utf8')
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }

    throw error
  }
}

export async function listBranchNames(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<string[]> {
  const branches = await octokit.paginate(octokit.rest.repos.listBranches, {
    owner,
    repo,
    per_page: 100
  })

  return branches.map((branch) => branch.name)
}
