import type { UpdatePullRequest } from './types'

const UPDATE_BRANCH_PREFIX = 'plugin/'

// Branches from before the prefix changed, still recognised so their open PRs are found.
const LEGACY_UPDATE_BRANCH_PREFIX = 'plugin-update/'

// Includes the base branch so the same update can be open for several environments at once,
// e.g. "plugin/develop/wordpress-seo-28-8" and "plugin/master/wordpress-seo-28-8". Dots in the
// version become dashes, so "28.8" is written "28-8".
export function getUpdateBranchName(baseBranch: string, slug: string, version: string): string {
  return `${UPDATE_BRANCH_PREFIX}${baseBranch}/${slug}-${version.replaceAll('.', '-')}`
}

export function isUpdateBranch(branch: string): boolean {
  return [UPDATE_BRANCH_PREFIX, LEGACY_UPDATE_BRANCH_PREFIX].some((prefix) =>
    branch.startsWith(prefix)
  )
}

// Matches the last part of the branch, "<slug>-<version>", so "plugin/<base>/<slug>-28-8" and
// older names such as "plugin-update/<slug>-28.8" are found too. The version must
// start with a digit, so "wordpress-seo" doesn't match "wordpress-seo-premium".
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
