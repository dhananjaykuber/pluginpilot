import { RefreshCwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePluginScan } from '@/hooks/usePluginScan'
import { cn } from '@/lib/utils'

type ScanButtonProps = {
  projectId: string
  branch: string
}

export function ScanButton({ projectId, branch }: ScanButtonProps): React.JSX.Element {
  const scan = usePluginScan(projectId, branch)

  return (
    <Button variant="outline" onClick={() => scan.refetch()} disabled={scan.isFetching}>
      <RefreshCwIcon data-icon="inline-start" className={cn(scan.isFetching && 'animate-spin')} />
      {scan.isFetching ? 'Scanning…' : 'Scan'}
    </Button>
  )
}
