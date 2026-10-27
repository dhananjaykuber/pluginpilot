import { CircleAlertIcon, CircleCheckIcon, Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      <p className="flex items-center gap-2 text-sm text-destructive">
        <CircleAlertIcon className="size-4" />
        Couldn&apos;t check for updates: {getErrorMessage(error)}
        <Button variant="link" size="sm" className="h-auto p-0" onClick={onRetry}>
          Try again
        </Button>
      </p>
    )
  }

  if (isChecking) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Checking WordPress.org for updates…
      </p>
    )
  }

  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <CircleCheckIcon className="size-4" />
      {updateCount > 0
        ? `${pluralize(updateCount, 'update')} available on WordPress.org`
        : 'All WordPress.org plugins are up to date'}
    </p>
  )
}
