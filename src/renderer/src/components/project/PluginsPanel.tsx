import { useState } from 'react'
import { PuzzleIcon, TriangleAlertIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { usePluginScan } from '@/hooks/usePluginScan'
import { getErrorMessage } from '@/lib/errors'
import { filterPlugins } from '@/lib/plugins'
import { PluginsTable, PluginsTableSkeleton } from './PluginsTable'
import { PluginsToolbar } from './PluginsToolbar'

type PluginsPanelProps = {
  projectId: string
  branch: string
}

export function PluginsPanel({ projectId, branch }: PluginsPanelProps): React.JSX.Element {
  const scan = usePluginScan(projectId, branch)
  const [search, setSearch] = useState('')

  if (scan.isPending) {
    return <PluginsTableSkeleton />
  }

  if (scan.isError) {
    return (
      <EmptyState
        icon={TriangleAlertIcon}
        title="Couldn't scan plugins"
        description={getErrorMessage(scan.error)}
        action={
          <Button variant="outline" onClick={() => scan.refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  const { plugins, scannedAt } = scan.data

  if (plugins.length === 0) {
    return (
      <EmptyState
        icon={PuzzleIcon}
        title="No plugins found"
        description={`No plugins were found on the ${branch} branch. Check the project's plugin folders.`}
      />
    )
  }

  const visiblePlugins = filterPlugins(plugins, search)

  return (
    <div className="space-y-3">
      <PluginsToolbar
        search={search}
        onSearchChange={setSearch}
        totalCount={plugins.length}
        scannedAt={scannedAt}
      />
      {visiblePlugins.length > 0 ? (
        <PluginsTable plugins={visiblePlugins} />
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No plugins match your search.
        </p>
      )}
    </div>
  )
}
