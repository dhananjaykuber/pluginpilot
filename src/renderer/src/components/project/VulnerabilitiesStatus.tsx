import { Link } from 'react-router'
import type { VulnerabilityReport } from '@shared/types'
import { Button } from '@/components/ui/button'
import { StatusLine } from '@/components/common/StatusLine'
import { getErrorMessage } from '@/lib/errors'
import { pluralize } from '@/lib/format'
import { paths } from '@/lib/paths'

type VulnerabilitiesStatusProps = {
  report: VulnerabilityReport | null | undefined
  isChecking: boolean
  error: Error | null
  vulnerablePluginCount: number
  onRetry: () => void
}

export function VulnerabilitiesStatus({
  report,
  isChecking,
  error,
  vulnerablePluginCount,
  onRetry
}: VulnerabilitiesStatusProps): React.JSX.Element {
  if (error) {
    return (
      <StatusLine tone="error">
        Couldn&apos;t check vulnerabilities: {getErrorMessage(error)}{' '}
        <Button variant="link" size="sm" className="h-auto p-0" onClick={onRetry}>
          Try again
        </Button>
      </StatusLine>
    )
  }

  if (isChecking) {
    return <StatusLine tone="loading">Checking known vulnerabilities…</StatusLine>
  }

  if (!report) {
    return (
      <StatusLine tone="warning">
        <Link
          to={paths.settings}
          className="font-medium text-foreground underline underline-offset-4"
        >
          Add a Wordfence API key
        </Link>{' '}
        to check plugins for known vulnerabilities.
      </StatusLine>
    )
  }

  if (vulnerablePluginCount > 0) {
    return (
      <StatusLine tone="warning">
        {pluralize(vulnerablePluginCount, 'plugin')} with known vulnerabilities
      </StatusLine>
    )
  }

  return <StatusLine tone="success">No known vulnerabilities</StatusLine>
}
