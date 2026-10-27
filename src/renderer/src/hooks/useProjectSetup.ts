import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Project, RepositorySetup } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

// Branches and detected folders for an existing project, read from its first environment's branch.
export function useProjectSetup(project: Project): UseQueryResult<RepositorySetup> {
  const { owner, name } = project.repo
  const branch = project.environments[0]?.branch ?? ''

  return useQuery({
    queryKey: queryKeys.repositorySetup(`${owner}/${name}`, branch),
    queryFn: () => window.api.repositories.detectSetup(owner, name, branch),
    staleTime: 60_000
  })
}
