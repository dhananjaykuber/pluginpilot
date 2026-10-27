import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { PluginScan } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

export function usePluginScan(projectId: string, branch: string): UseQueryResult<PluginScan> {
  return useQuery({
    queryKey: queryKeys.pluginScan(projectId, branch),
    queryFn: () => window.api.plugins.scan(projectId, branch),
    // A scan makes many GitHub API calls, so only repeat it when asked to.
    staleTime: Infinity
  })
}
