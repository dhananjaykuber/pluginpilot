import { useState } from 'react'
import type { PluginScan } from '@shared/types'
import { usePluginReleases } from '@/hooks/usePluginReleases'
import { useRecordScanSummary } from '@/hooks/useScanSummaries'
import { usePluginSelection } from '@/hooks/usePluginSelection'
import { useUpdatePullRequests } from '@/hooks/useUpdatePullRequests'
import { useVulnerabilities } from '@/hooks/useVulnerabilities'
import { filterPlugins, toPluginListItems, type PluginFilter } from '@/lib/plugins'
import { getBulkUpdates, type UpdateTarget } from '@/lib/pluginUpdate'
import { BulkActionBar } from './BulkActionBar'
import { PluginFilterMenu } from './PluginFilterMenu'
import { PluginsTable } from './PluginsTable'
import { PluginsToolbar } from './PluginsToolbar'
import { ReleasesStatus } from './ReleasesStatus'
import { VulnerabilitiesStatus } from './VulnerabilitiesStatus'

type PluginsListProps = {
  scan: PluginScan
  target: UpdateTarget
}

export function PluginsList({ scan, target }: PluginsListProps): React.JSX.Element {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<PluginFilter>('all')
  const releases = usePluginReleases(scan.plugins.map((plugin) => plugin.slug))
  const vulnerabilities = useVulnerabilities(
    scan.plugins.map(({ slug, version }) => ({ slug, version }))
  )

  const pullRequests = useUpdatePullRequests(target)

  const items = toPluginListItems(
    scan.plugins,
    releases.data,
    vulnerabilities.data,
    pullRequests.data
  )
  const visibleItems = filterPlugins(items, search, filter)
  const bulkUpdates = getBulkUpdates(items, target)
  const selection = usePluginSelection([...bulkUpdates.keys()])
  const selectedUpdates = selection.selectedSlugs.flatMap((slug) => bulkUpdates.get(slug) ?? [])
  const updateCount = items.filter((item) => item.availableVersion).length
  const vulnerablePluginCount = items.filter((item) => item.vulnerabilities?.length).length
  const hasFinishedChecks = releases.isSuccess && vulnerabilities.isSuccess

  useRecordScanSummary(
    target,
    hasFinishedChecks
      ? {
          scannedAt: scan.scannedAt,
          pluginCount: items.length,
          updateCount,
          vulnerableCount: vulnerabilities.data ? vulnerablePluginCount : null
        }
      : null
  )

  return (
    <div className="space-y-3">
      <PluginsToolbar
        search={search}
        onSearchChange={setSearch}
        visibleCount={visibleItems.length}
        totalCount={items.length}
        scannedAt={scan.scannedAt}
        filterMenu={<PluginFilterMenu value={filter} onChange={setFilter} plugins={items} />}
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
      <BulkActionBar updates={selectedUpdates} target={target} onClear={selection.clear} />
      {visibleItems.length > 0 ? (
        <PluginsTable
          plugins={visibleItems}
          target={target}
          selection={selection}
          selectableSlugs={new Set(bulkUpdates.keys())}
        />
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No plugins match the current filter and search.
        </p>
      )}
    </div>
  )
}
