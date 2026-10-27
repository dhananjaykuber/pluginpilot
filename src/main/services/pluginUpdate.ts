import type { Octokit } from '@octokit/rest'
import { getUpdateBranchName } from '../../shared/pluginUpdate'
import type {
  PluginUpdateRequest,
  PluginUpdateResult,
  PluginUpdateStep,
  UpdatePullRequest
} from '../../shared/types'
import { updateComposerPackage } from './composerUpdate'
import { getAuthenticatedOctokit } from './github'
import { readTextFile } from './githubContent'
import { commitFolderReplacement, commitTextFiles } from './githubTree'
import { downloadPluginZip, extractPluginFiles, readPluginVersion } from './pluginZip'
import { getProject } from './projects'
import { buildUpdateBody, buildUpdateTitle } from './pullRequestContent'
import { createBranch, createPullRequest, listOpenUpdatePullRequests } from './pullRequests'

type ManualUpdate = Extract<PluginUpdateRequest, { source: 'manual' }>
type ComposerUpdate = Extract<PluginUpdateRequest, { source: 'composer' }>
type ProgressListener = (step: PluginUpdateStep) => void

// Where the update commit goes: on top of the environment branch.
type CommitTarget = {
  octokit: Octokit
  owner: string
  repo: string
  baseBranch: string
  message: string
}

export function listUpdatePullRequests(
  projectId: string,
  baseBranch: string
): Promise<UpdatePullRequest[]> {
  const { owner, name: repo } = getProject(projectId).repo

  return listOpenUpdatePullRequests(getAuthenticatedOctokit(), owner, repo, baseBranch)
}

// Commits the new plugin version to a new branch and opens a pull request against the
// environment's branch.
export async function updatePlugin(
  request: PluginUpdateRequest,
  onProgress: ProgressListener
): Promise<PluginUpdateResult> {
  const project = getProject(request.projectId)
  const environment = project.environments.find((env) => env.name === request.environmentName)

  if (!environment) {
    throw new Error(`Environment ${request.environmentName} was not found.`)
  }

  const octokit = getAuthenticatedOctokit()
  const { owner, name: repo } = project.repo
  const branch = getUpdateBranchName(request.slug, request.toVersion)
  const title = buildUpdateTitle(request)
  const target: CommitTarget = {
    octokit,
    owner,
    repo,
    baseBranch: environment.branch,
    message: title
  }

  const commitSha =
    request.source === 'composer'
      ? await commitComposerUpdate(target, request, onProgress)
      : await commitManualUpdate(target, request, onProgress)
  await createBranch(octokit, { owner, repo, branch, commitSha })

  onProgress('pull-request')
  const pullRequest = await createPullRequest(octokit, {
    owner,
    repo,
    head: branch,
    base: environment.branch,
    title,
    body: buildUpdateBody(request, environment.branch)
  })

  return { branch, pullRequestNumber: pullRequest.number, pullRequestUrl: pullRequest.url }
}

// Replaces the committed plugin folder with the contents of the WordPress.org zip.
async function commitManualUpdate(
  target: CommitTarget,
  request: ManualUpdate,
  onProgress: ProgressListener
): Promise<string> {
  onProgress('prepare')
  const files = extractPluginFiles(await downloadPluginZip(request.downloadUrl))
  const downloadedVersion = readPluginVersion(files)

  if (downloadedVersion !== request.toVersion) {
    throw new Error(
      `The downloaded zip contains version ${downloadedVersion ?? 'unknown'}, expected ${request.toVersion}.`
    )
  }

  onProgress('commit')
  return commitFolderReplacement(target.octokit, {
    ...target,
    folderPath: request.path,
    files
  })
}

// Updates the package in composer.lock (and composer.json if needed). Plugin code isn't committed.
async function commitComposerUpdate(
  target: CommitTarget,
  request: ComposerUpdate,
  onProgress: ProgressListener
): Promise<string> {
  onProgress('prepare')
  const location = { owner: target.owner, repo: target.repo, ref: target.baseBranch }
  const [composerJson, composerLock] = await Promise.all([
    readTextFile(target.octokit, location, 'composer.json'),
    readTextFile(target.octokit, location, 'composer.lock')
  ])

  if (!composerJson || !composerLock) {
    throw new Error('Both composer.json and composer.lock are needed to update a Composer plugin.')
  }

  const updated = await updateComposerPackage({
    composerJson,
    composerLock,
    packageName: request.packageName,
    version: request.toVersion
  })

  onProgress('commit')
  return commitTextFiles(target.octokit, {
    ...target,
    files: [
      { path: 'composer.json', content: updated.composerJson },
      { path: 'composer.lock', content: updated.composerLock }
    ]
  })
}
