import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { RepositorySetup, RepositorySummary } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

export function useRepositorySetup(repository: RepositorySummary): UseQueryResult<RepositorySetup> {
  const { owner, name, fullName, defaultBranch } = repository

  return useQuery({
    queryKey: queryKeys.repositorySetup(fullName, defaultBranch),
    queryFn: () => window.api.repositories.detectSetup(owner, name, defaultBranch),
    staleTime: 60_000
  })
}
