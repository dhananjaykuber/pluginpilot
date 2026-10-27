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
  labels: string[]
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
  const { labels, ...details } = pullRequest
  const { data } = await octokit.rest.pulls.create(details)

  if (labels.length > 0) {
    await addLabels(octokit, { ...pullRequest, number: data.number })
  }

  return { number: data.number, url: data.html_url }
}

// GitHub creates labels that don't exist in the repository yet.
async function addLabels(
  octokit: Octokit,
  pullRequest: { owner: string; repo: string; number: number; labels: string[] }
): Promise<void> {
  const { owner, repo, number, labels } = pullRequest

  try {
    await octokit.rest.issues.addLabels({ owner, repo, issue_number: number, labels })
  } catch (error) {
    throw new Error(
      `Pull request #${number} was created, but its labels couldn't be added: ${getMessage(error)}`,
      { cause: error }
    )
  }
}

function getMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
