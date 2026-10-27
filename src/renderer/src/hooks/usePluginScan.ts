import { useQueries, useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { PluginScan } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

// Shared so the Plugins and Compare views reuse the same cached scans.
function pluginScanQuery(
  projectId: string,
  branch: string
): {
  queryKey: readonly unknown[]
  queryFn: () => Promise<PluginScan>
  staleTime: number
} {
  return {
    queryKey: queryKeys.pluginScan(projectId, branch),
    queryFn: () => window.api.plugins.scan(projectId, branch),
    // A scan makes many GitHub API calls, so only repeat it when asked to.
    staleTime: Infinity
  }
}

export function usePluginScan(projectId: string, branch: string): UseQueryResult<PluginScan> {
  return useQuery(pluginScanQuery(projectId, branch))
}

export function usePluginScans(
  projectId: string,
  branches: string[]
): UseQueryResult<PluginScan>[] {
  return useQueries({ queries: branches.map((branch) => pluginScanQuery(projectId, branch)) })
}
