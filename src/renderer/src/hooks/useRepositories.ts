import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { RepositorySummary } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

export function useRepositories(): UseQueryResult<RepositorySummary[]> {
  // The list remembered from the last load shows instantly while a fresh one loads.
  const cached = useQuery({
    queryKey: queryKeys.cachedRepositories,
    queryFn: () => window.api.repositories.listCached(),
    staleTime: Infinity
  })

  return useQuery({
    queryKey: queryKeys.repositories,
    queryFn: () => window.api.repositories.list(),
    placeholderData: cached.data ?? undefined,
    // Refetch when returning to the app, e.g. after authorizing the token for another org.
    staleTime: 60_000
  })
}
