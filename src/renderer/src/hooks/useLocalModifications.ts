import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { PluginModifications } from '@shared/types'
import type { NewPluginUpdate } from '@/lib/pluginUpdate'

// Only committed WordPress.org plugins can be compared with their original zip.
export function useLocalModifications(
  update: NewPluginUpdate
): UseQueryResult<PluginModifications> {
  const { projectId, environmentName, slug, path, fromVersion } = update
  const canCompare = update.source === 'manual' && update.zip.from === 'wordpress-org'

  return useQuery({
    queryKey: ['modifications', projectId, environmentName, slug, fromVersion],
    queryFn: () =>
      window.api.plugins.findModifications({
        projectId,
        environmentName,
        slug,
        path,
        version: fromVersion
      }),
    enabled: canCompare,
    staleTime: 60_000
  })
}
