import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { PluginVersion, VulnerabilityReport } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

const ONE_HOUR = 60 * 60 * 1000

// Resolves to null when no Wordfence API key is configured.
export function useVulnerabilities(
  plugins: PluginVersion[]
): UseQueryResult<VulnerabilityReport | null> {
  return useQuery({
    queryKey: queryKeys.pluginVulnerabilities(plugins),
    queryFn: () => window.api.vulnerabilities.check(plugins),
    enabled: plugins.length > 0,
    staleTime: ONE_HOUR
  })
}
