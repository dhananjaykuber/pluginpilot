import type { UpdatePullRequest } from './types'

export const UPDATE_BRANCH_PREFIX = 'plugin-update/'

export function getUpdateBranchName(slug: string, version: string): string {
  return `${UPDATE_BRANCH_PREFIX}${slug}-${version}`
}

// Matches "plugin-update/<slug>-<version>". The version must start with a digit, so
// "wordpress-seo" doesn't match a branch for "wordpress-seo-premium".
export function findUpdatePullRequest(
  pullRequests: UpdatePullRequest[],
  slug: string
): UpdatePullRequest | null {
  const prefix = `${UPDATE_BRANCH_PREFIX}${slug}-`

  return (
    pullRequests.find(
      (pullRequest) =>
        pullRequest.branch.startsWith(prefix) && /^\d/.test(pullRequest.branch.slice(prefix.length))
    ) ?? null
  )
}
