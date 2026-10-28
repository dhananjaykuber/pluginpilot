import { RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { ScanAllResult } from '@shared/types'
import { Button } from '@/components/ui/button'
import { useScanAll } from '@/hooks/useScanAll'
import { getErrorMessage } from '@/lib/errors'
import { pluralize } from '@/lib/format'
import { cn } from '@/lib/utils'

// Scans every environment of every project and refreshes the counts in the table.
export function ScanAllProjectsButton(): React.JSX.Element {
  const { scan, progress } = useScanAll()
  const isScanning = scan.isPending || progress !== null

  function handleScan(): void {
    scan.mutate(undefined, {
      onSuccess: (result) => {
        const { title, description } = describeResult(result)
        const notify = result.criticalCount > 0 ? toast.warning : toast.success
        notify(title, { description })
      },
      onError: (error) => toast.error(getErrorMessage(error))
    })
  }

  return (
    <Button variant="outline" onClick={handleScan} disabled={isScanning}>
      <RefreshCwIcon data-icon="inline-start" className={cn(isScanning && 'animate-spin')} />
      {isScanning
        ? progress
          ? `Scanning ${progress.done}/${progress.total}…`
          : 'Scanning…'
        : 'Scan all'}
    </Button>
  )
}

function describeResult(result: ScanAllResult): { title: string; description?: string } {
  const failed = result.results.filter((environment) => environment.error)
  const scanned = result.results.length - failed.length
  const details = [
    result.criticalCount > 0 &&
      `${pluralize(result.criticalCount, 'critical vulnerability', 'critical vulnerabilities')} found`,
    failed.length > 0 && `${pluralize(failed.length, 'environment')} couldn't be scanned`
  ].filter(Boolean)

  return {
    title: `Scanned ${pluralize(scanned, 'environment')}`,
    description: details.length > 0 ? details.join(' · ') : undefined
  }
}
