import { Link } from 'react-router'
import { ArrowUpCircleIcon, ShieldAlertIcon } from 'lucide-react'
import type { ScanSummary } from '@shared/types'
import { Badge } from '@/components/ui/badge'
import { getEnvironmentColor } from '@/lib/environments'
import { formatRelativeTime, pluralize } from '@/lib/format'
import { paths } from '@/lib/paths'

type EnvironmentBadgeProps = {
  projectId: string
  name: string
  branch: string
  summary: ScanSummary | undefined
}

// Opens the project with this environment already selected. Shows counts from its last scan.
export function EnvironmentBadge({
  projectId,
  name,
  branch,
  summary
}: EnvironmentBadgeProps): React.JSX.Element {
  return (
    <Badge
      className={getEnvironmentColor(name).badge}
      render={
        <Link
          to={paths.projectEnvironment(projectId, name)}
          title={`${name} → ${branch} · ${describeSummary(summary)}`}
        />
      }
    >
      {name}
      {!!summary?.updateCount && (
        <span className="inline-flex items-center gap-0.5">
          <ArrowUpCircleIcon className="size-3" />
          {summary.updateCount}
        </span>
      )}
      {!!summary?.vulnerableCount && (
        <span className="inline-flex items-center gap-0.5 text-red-700 dark:text-red-400">
          <ShieldAlertIcon className="size-3" />
          {summary.vulnerableCount}
        </span>
      )}
    </Badge>
  )
}

function describeSummary(summary: ScanSummary | undefined): string {
  if (!summary) {
    return 'not scanned yet'
  }

  const vulnerable =
    summary.vulnerableCount === null
      ? 'vulnerabilities not checked'
      : `${pluralize(summary.vulnerableCount, 'vulnerable plugin')}`

  return [
    pluralize(summary.updateCount, 'update'),
    vulnerable,
    `scanned ${formatRelativeTime(summary.scannedAt)}`
  ].join(' · ')
}
