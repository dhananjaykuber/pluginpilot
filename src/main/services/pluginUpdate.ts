import { getUpdateBranchName } from '../../shared/pluginUpdate'
import type {
  PluginUpdateRequest,
  PluginUpdateResult,
  PluginUpdateStep,
  UpdatePullRequest
} from '../../shared/types'
import { getAuthenticatedOctokit } from './github'
import { commitFolderReplacement } from './githubTree'
import { downloadPluginZip, extractPluginFiles, readPluginVersion } from './pluginZip'
import { getProject } from './projects'
import { buildUpdateBody, buildUpdateTitle } from './pullRequestContent'
import { createBranch, createPullRequest, listOpenUpdatePullRequests } from './pullRequests'

export function listUpdatePullRequests(
  projectId: string,
  baseBranch: string
): Promise<UpdatePullRequest[]> {
  const { owner, name: repo } = getProject(projectId).repo

  return listOpenUpdatePullRequests(getAuthenticatedOctokit(), owner, repo, baseBranch)
}

// Replaces a committed plugin folder with the new version and opens a pull request
// against the environment's branch.
export async function updatePlugin(
  request: PluginUpdateRequest,
  onProgress: (step: PluginUpdateStep) => void
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

  onProgress('download')
  const files = extractPluginFiles(await downloadPluginZip(request.downloadUrl))
  const downloadedVersion = readPluginVersion(files)

  if (downloadedVersion !== request.toVersion) {
    throw new Error(
      `The downloaded zip contains version ${downloadedVersion ?? 'unknown'}, expected ${request.toVersion}.`
    )
  }

  onProgress('commit')
  const commitSha = await commitFolderReplacement(octokit, {
    owner,
    repo,
    baseBranch: environment.branch,
    folderPath: request.path,
    files,
    message: title
  })
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
