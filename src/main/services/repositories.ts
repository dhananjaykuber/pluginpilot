import type { RepositorySummary } from '../../shared/types'
import { getAuthenticatedOctokit } from './github'

// Lists repositories the signed-in user can push to, since update PRs need a new branch.
export async function listAccessibleRepositories(): Promise<RepositorySummary[]> {
  const octokit = getAuthenticatedOctokit()

  const repositories = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
    affiliation: 'owner,collaborator,organization_member',
    sort: 'full_name',
    per_page: 100
  })

  return repositories
    .filter((repository) => repository.permissions?.push)
    .map((repository) => ({
      owner: repository.owner.login,
      name: repository.name,
      fullName: repository.full_name,
      isPrivate: repository.private,
      defaultBranch: repository.default_branch,
      ownerAvatarUrl: repository.owner.avatar_url
    }))
}
