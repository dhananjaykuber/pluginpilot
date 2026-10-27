import { PuzzleIcon, TriangleAlertIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { usePluginScan } from '@/hooks/usePluginScan'
import { getErrorMessage } from '@/lib/errors'
import { PluginsList } from './PluginsList'
import { PluginsTableSkeleton } from './PluginsTable'

type PluginsPanelProps = {
  projectId: string
  branch: string
}

export function PluginsPanel({ projectId, branch }: PluginsPanelProps): React.JSX.Element {
  const scan = usePluginScan(projectId, branch)

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

  if (scan.data.plugins.length === 0) {
    return (
      <EmptyState
        icon={PuzzleIcon}
        title="No plugins found"
        description={`No plugins were found on the ${branch} branch. Check the project's plugin folders.`}
      />
    )
  }

  return <PluginsList scan={scan.data} />
}
