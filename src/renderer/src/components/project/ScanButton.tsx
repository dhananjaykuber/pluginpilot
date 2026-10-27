import { useQueryClient } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePluginScan } from '@/hooks/usePluginScan'
import { queryKeys } from '@/lib/queryClient'
import { cn } from '@/lib/utils'

type ScanButtonProps = {
  projectId: string
  branch: string
}

// Rescans the branch and refreshes its open update pull requests, since merging a pull
// request changes both.
export function ScanButton({ projectId, branch }: ScanButtonProps): React.JSX.Element {
  const queryClient = useQueryClient()
  const scan = usePluginScan(projectId, branch)

  function handleScan(): void {
    scan.refetch()
    queryClient.invalidateQueries({ queryKey: queryKeys.updatePullRequests(projectId, branch) })
  }

  return (
    <Button variant="outline" onClick={handleScan} disabled={scan.isFetching}>
      <RefreshCwIcon data-icon="inline-start" className={cn(scan.isFetching && 'animate-spin')} />
      {scan.isFetching ? 'Scanning…' : 'Scan'}
    </Button>
  )
}
