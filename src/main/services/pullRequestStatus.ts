import type { Octokit } from '@octokit/rest'
import type { ChecksStatus, ReviewStatus } from '../../shared/types'

type CommitRef = {
  owner: string
  repo: string
  ref: string
}

type PullRequestRef = {
  owner: string
  repo: string
  pull_number: number
}

const FAILED_CONCLUSIONS = new Set(['failure', 'timed_out', 'cancelled', 'action_required'])

// Combines GitHub check runs (e.g. Actions) with classic commit statuses (e.g. older CI services).
export async function getChecksStatus(octokit: Octokit, commit: CommitRef): Promise<ChecksStatus> {
  const [checkRuns, combinedStatus] = await Promise.all([
    octokit.paginate(octokit.rest.checks.listForRef, { ...commit, per_page: 100 }),
    octokit.rest.repos.getCombinedStatusForRef(commit)
  ])
  const statuses = combinedStatus.data.statuses

  if (checkRuns.length === 0 && statuses.length === 0) {
    return 'none'
  }

  const hasFailure =
    checkRuns.some((run) => run.conclusion && FAILED_CONCLUSIONS.has(run.conclusion)) ||
    statuses.some((status) => status.state === 'failure' || status.state === 'error')

  if (hasFailure) {
    return 'failing'
  }

  const isRunning =
    checkRuns.some((run) => run.status !== 'completed') ||
    statuses.some((status) => status.state === 'pending')

  return isRunning ? 'pending' : 'passing'
}

// Uses each reviewer's latest decision; comments alone don't count.
export async function getReviewStatus(
  octokit: Octokit,
  pullRequest: PullRequestRef
): Promise<ReviewStatus> {
  const reviews = await octokit.paginate(octokit.rest.pulls.listReviews, {
    ...pullRequest,
    per_page: 100
  })
  const latestByReviewer = new Map<string, string>()

  for (const review of reviews) {
    if (review.user && (review.state === 'APPROVED' || review.state === 'CHANGES_REQUESTED')) {
      latestByReviewer.set(review.user.login, review.state)
    }
  }

  const decisions = [...latestByReviewer.values()]

  if (decisions.includes('CHANGES_REQUESTED')) {
    return 'changes-requested'
  }

  return decisions.includes('APPROVED') ? 'approved' : 'pending'
}
