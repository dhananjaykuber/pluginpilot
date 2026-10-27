import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { queryKeys } from '@/lib/queryClient'
import { cn } from '@/lib/utils'

type ScanAllButtonProps = {
  projectId: string
}

// Rescans every environment of the project, plus their open update pull requests.
export function ScanAllButton({ projectId }: ScanAllButtonProps): React.JSX.Element {
  const queryClient = useQueryClient()
  const isScanning = useIsFetching({ queryKey: queryKeys.projectPluginScans(projectId) }) > 0

  function handleScan(): void {
    queryClient.invalidateQueries({ queryKey: queryKeys.projectPluginScans(projectId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.projectUpdatePullRequests(projectId) })
  }

  return (
    <Button variant="outline" onClick={handleScan} disabled={isScanning}>
      <RefreshCwIcon data-icon="inline-start" className={cn(isScanning && 'animate-spin')} />
      {isScanning ? 'Scanning…' : 'Scan all'}
    </Button>
  )
}
