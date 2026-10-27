import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'

export function useAppVersion(): UseQueryResult<string> {
  return useQuery({
    queryKey: queryKeys.appVersion,
    queryFn: () => window.api.app.getVersion(),
    staleTime: Infinity
  })
}
