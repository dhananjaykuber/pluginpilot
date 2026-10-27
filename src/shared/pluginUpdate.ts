import type { UpdatePullRequest } from './types'

export const UPDATE_BRANCH_PREFIX = 'plugin-update/'

// Includes the base branch so the same update can be open for several environments at once,
// e.g. "plugin-update/develop/wordpress-seo-28.8" and "plugin-update/master/wordpress-seo-28.8".
export function getUpdateBranchName(baseBranch: string, slug: string, version: string): string {
  return `${UPDATE_BRANCH_PREFIX}${baseBranch}/${slug}-${version}`
}

// Matches "plugin-update/<base>/<slug>-<version>" and the older "plugin-update/<slug>-<version>",
// so pull requests opened before the base branch was part of the name are still found. The
// version must start with a digit, so "wordpress-seo" doesn't match "wordpress-seo-premium".
// `pullRequests` should already be limited to one base branch.
export function findUpdatePullRequest(
  pullRequests: UpdatePullRequest[],
  slug: string
): UpdatePullRequest | null {
  const namePrefix = `${slug}-`

  return (
    pullRequests.find((pullRequest) => {
      const name = pullRequest.branch.split('/').pop() ?? ''
      return name.startsWith(namePrefix) && /^\d/.test(name.slice(namePrefix.length))
    }) ?? null
  )
}
