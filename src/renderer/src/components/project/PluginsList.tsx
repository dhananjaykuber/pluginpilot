import { useState } from 'react'
import type { PluginScan } from '@shared/types'
import { usePluginReleases } from '@/hooks/usePluginReleases'
import { useVulnerabilities } from '@/hooks/useVulnerabilities'
import { filterPlugins, toPluginListItems } from '@/lib/plugins'
import { PluginsTable } from './PluginsTable'
import { PluginsToolbar } from './PluginsToolbar'
import { ReleasesStatus } from './ReleasesStatus'
import { VulnerabilitiesStatus } from './VulnerabilitiesStatus'

type PluginsListProps = {
  scan: PluginScan
}

export function PluginsList({ scan }: PluginsListProps): React.JSX.Element {
  const [search, setSearch] = useState('')
  const releases = usePluginReleases(scan.plugins.map((plugin) => plugin.slug))
  const vulnerabilities = useVulnerabilities(
    scan.plugins.map(({ slug, version }) => ({ slug, version }))
  )

  const items = toPluginListItems(scan.plugins, releases.data, vulnerabilities.data)
  const visibleItems = filterPlugins(items, search)
  const updateCount = items.filter((item) => item.availableVersion).length
  const vulnerablePluginCount = items.filter((item) => item.vulnerabilities?.length).length

  return (
    <div className="space-y-3">
      <PluginsToolbar
        search={search}
        onSearchChange={setSearch}
        totalCount={items.length}
        scannedAt={scan.scannedAt}
      />
      <div className="space-y-1">
        <ReleasesStatus
          isChecking={releases.isPending}
          error={releases.error}
          updateCount={updateCount}
          onRetry={() => releases.refetch()}
        />
        <VulnerabilitiesStatus
          report={vulnerabilities.data}
          isChecking={vulnerabilities.isPending}
          error={vulnerabilities.error}
          vulnerablePluginCount={vulnerablePluginCount}
          onRetry={() => vulnerabilities.refetch()}
        />
      </div>
      {visibleItems.length > 0 ? (
        <PluginsTable plugins={visibleItems} />
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No plugins match your search.
        </p>
      )}
    </div>
  )
}
