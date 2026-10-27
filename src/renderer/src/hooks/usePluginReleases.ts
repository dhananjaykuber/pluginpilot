import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { PluginReleaseQuery, PluginReleases } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

const ONE_HOUR = 60 * 60 * 1000

export function usePluginReleases(plugins: PluginReleaseQuery[]): UseQueryResult<PluginReleases> {
  return useQuery({
    queryKey: queryKeys.pluginReleases(plugins),
    queryFn: () => window.api.plugins.getReleases(plugins),
    enabled: plugins.length > 0,
    staleTime: ONE_HOUR
  })
}
