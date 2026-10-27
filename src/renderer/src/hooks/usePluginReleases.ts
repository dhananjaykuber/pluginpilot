import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { PluginReleases } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

const ONE_HOUR = 60 * 60 * 1000

export function usePluginReleases(slugs: string[]): UseQueryResult<PluginReleases> {
  return useQuery({
    queryKey: queryKeys.pluginReleases(slugs),
    queryFn: () => window.api.plugins.getReleases(slugs),
    enabled: slugs.length > 0,
    staleTime: ONE_HOUR
  })
}
