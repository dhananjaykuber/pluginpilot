import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { RepositorySummary } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

export function useRepositories(): UseQueryResult<RepositorySummary[]> {
  return useQuery({
    queryKey: queryKeys.repositories,
    queryFn: () => window.api.repositories.list(),
    // Refetch when returning to the app, e.g. after authorizing the token for another org.
    staleTime: 60_000
  })
}
