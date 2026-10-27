import { Button } from '@/components/ui/button'
import { StatusLine } from '@/components/common/StatusLine'
import { getErrorMessage } from '@/lib/errors'
import { pluralize } from '@/lib/format'

type ReleasesStatusProps = {
  isChecking: boolean
  error: Error | null
  updateCount: number
  onRetry: () => void
}

export function ReleasesStatus({
  isChecking,
  error,
  updateCount,
  onRetry
}: ReleasesStatusProps): React.JSX.Element {
  if (error) {
    return (
      <StatusLine tone="error">
        Couldn&apos;t check for updates: {getErrorMessage(error)}{' '}
        <Button variant="link" size="sm" className="h-auto p-0" onClick={onRetry}>
          Try again
        </Button>
      </StatusLine>
    )
  }

  if (isChecking) {
    return <StatusLine tone="loading">Checking for updates…</StatusLine>
  }

  return (
    <StatusLine tone="success">
      {updateCount > 0
        ? `${pluralize(updateCount, 'update')} available`
        : 'All plugins are up to date'}
    </StatusLine>
  )
}
