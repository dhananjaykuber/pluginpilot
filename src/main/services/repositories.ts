import type { RepositorySummary } from '../../shared/types'
import { mapWithConcurrency } from './concurrency'
import { getAuthenticatedOctokit } from './github'
import { saveCachedRepositories } from './repositoryCache'

const PAGE_SIZE = 100
const PAGE_CONCURRENCY = 12

// Lists repositories the signed-in user can push to, since update PRs need a new branch.
export async function listAccessibleRepositories(): Promise<RepositorySummary[]> {
  const octokit = getAuthenticatedOctokit()
  const listPage = (page: number): ReturnType<typeof octokit.rest.repos.listForAuthenticatedUser> =>
    octokit.rest.repos.listForAuthenticatedUser({
      affiliation: 'owner,collaborator,organization_member',
      sort: 'full_name',
      per_page: PAGE_SIZE,
      page
    })

  // Members of large organizations can see thousands of repositories. The first page says how
  // many pages there are, so the rest are fetched in parallel instead of one after another.
  const firstPage = await listPage(1)
  const otherPages = await mapWithConcurrency(
    range(2, getLastPage(firstPage.headers.link)),
    PAGE_CONCURRENCY,
    async (page) => (await listPage(page)).data
  )

  const repositories = [firstPage.data, ...otherPages]
    .flat()
    .filter((repository) => repository.permissions?.push)
    .map((repository) => ({
      owner: repository.owner.login,
      name: repository.name,
      fullName: repository.full_name,
      isPrivate: repository.private,
      defaultBranch: repository.default_branch,
      ownerAvatarUrl: repository.owner.avatar_url
    }))

  saveCachedRepositories(repositories)
  return repositories
}

// '<…&page=12>; rel="last"' → 12. Without a "last" link there's only one page.
function getLastPage(link: string | undefined): number {
  const match = link?.match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/)
  return match ? Number(match[1]) : 1
}

function range(from: number, to: number): number[] {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, index) => from + index)
}
