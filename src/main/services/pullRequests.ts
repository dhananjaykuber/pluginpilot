import type { Octokit } from '@octokit/rest'
import { isUnprocessableError } from './github'

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

export async function createPullRequest(
  octokit: Octokit,
  pullRequest: NewPullRequest
): Promise<{ number: number; url: string }> {
  const { data } = await octokit.rest.pulls.create(pullRequest)

  return { number: data.number, url: data.html_url }
}
