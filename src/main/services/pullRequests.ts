import type { Octokit } from '@octokit/rest'
import { isUpdateBranch } from '../../shared/pluginUpdate'
import type { UpdatePullRequest } from '../../shared/types'
import { isUnprocessableError } from './github'
import { getChecksStatus, getReviewStatus } from './pullRequestStatus'

type NewBranch = {
  owner: string
  repo: string
  branch: string
  commitSha: string
}

type NewPullRequest = {
  owner: string
  repo: string
  head: string
  base: string
  title: string
  body: string
}

export async function createBranch(octokit: Octokit, newBranch: NewBranch): Promise<void> {
  const { owner, repo, branch, commitSha } = newBranch

  try {
    await octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${branch}`, sha: commitSha })
  } catch (error) {
    if (isUnprocessableError(error)) {
      throw new Error(
        `Branch ${branch} already exists. Delete it or merge its pull request first.`,
        {
          cause: error
        }
      )
    }

    throw error
  }
}

// Open pull requests created by PluginPilot (or following its branch naming) against `base`.
export async function listOpenUpdatePullRequests(
  octokit: Octokit,
  owner: string,
  repo: string,
  base: string
): Promise<UpdatePullRequest[]> {
  const pullRequests = await octokit.paginate(octokit.rest.pulls.list, {
    owner,
    repo,
    base,
    state: 'open',
    per_page: 100
  })

  const updatePullRequests = pullRequests.filter((pullRequest) =>
    isUpdateBranch(pullRequest.head.ref)
  )

  return Promise.all(
    updatePullRequests.map(async (pullRequest) => {
      const [checks, review] = await Promise.all([
        getChecksStatus(octokit, { owner, repo, ref: pullRequest.head.sha }),
        getReviewStatus(octokit, { owner, repo, pull_number: pullRequest.number })
      ])

      return {
        number: pullRequest.number,
        url: pullRequest.html_url,
        branch: pullRequest.head.ref,
        checks,
        review
      }
    })
  )
}

export async function createPullRequest(
  octokit: Octokit,
  pullRequest: NewPullRequest
): Promise<{ number: number; url: string }> {
  const { data } = await octokit.rest.pulls.create(pullRequest)

  return { number: data.number, url: data.html_url }
}
