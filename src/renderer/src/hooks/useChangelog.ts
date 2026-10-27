import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { ChangelogEntry } from '@shared/types'
import type { NewPluginUpdate } from '@/lib/pluginUpdate'

const ONE_HOUR = 60 * 60 * 1000

// Release notes between the installed and new version. Only WordPress.org plugins have them.
export function useChangelog(update: NewPluginUpdate): UseQueryResult<ChangelogEntry[]> {
  const { slug, fromVersion, toVersion, changelogUrl } = update

  return useQuery({
    queryKey: ['changelog', slug, fromVersion, toVersion],
    queryFn: () => window.api.plugins.getChangelog(slug, fromVersion, toVersion),
    enabled: changelogUrl !== null,
    staleTime: ONE_HOUR
  })
}
