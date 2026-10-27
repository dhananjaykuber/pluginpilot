import { useState } from 'react'
import { GitCompareArrowsIcon } from 'lucide-react'
import type { Project } from '@shared/types'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusLine } from '@/components/common/StatusLine'
import { usePluginScans } from '@/hooks/usePluginScan'
import { buildComparisonRows } from '@/lib/environmentComparison'
import { sortEnvironments } from '@/lib/environments'
import { getErrorMessage } from '@/lib/errors'
import { pluralize } from '@/lib/format'
import { ComparisonTable } from './ComparisonTable'
import { PluginsTableSkeleton } from './PluginsTable'

type EnvironmentComparisonProps = {
  project: Project
}

export function EnvironmentComparison({ project }: EnvironmentComparisonProps): React.JSX.Element {
  const [onlyDifferences, setOnlyDifferences] = useState(false)
  const environments = sortEnvironments(project.environments)
  const scans = usePluginScans(
    project.id,
    environments.map((environment) => environment.branch)
  )

  if (scans.every((scan) => scan.isPending)) {
    return <PluginsTableSkeleton />
  }

  if (project.environments.length < 2) {
    return (
      <EmptyState
        icon={GitCompareArrowsIcon}
        title="Only one environment"
        description="Add another environment in project settings to compare plugin versions."
      />
    )
  }

  const rows = buildComparisonRows(scans.map((scan) => scan.data))
  const differingCount = rows.filter((row) => row.differs).length
  const visibleRows = onlyDifferences ? rows.filter((row) => row.differs) : rows
  const failedScans = scans.flatMap((scan, index) =>
    scan.isError ? [`${environments[index].name}: ${getErrorMessage(scan.error)}`] : []
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <StatusLine tone={differingCount > 0 ? 'warning' : 'success'}>
          {differingCount > 0
            ? `${pluralize(differingCount, 'plugin')} differ between environments`
            : 'All environments have the same plugin versions'}
        </StatusLine>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={onlyDifferences}
            onCheckedChange={(checked) => setOnlyDifferences(checked === true)}
          />
          Only show differences
        </label>
      </div>
      {failedScans.map((message) => (
        <StatusLine key={message} tone="error">
          Couldn&apos;t scan {message}
        </StatusLine>
      ))}
      <ComparisonTable environments={environments} rows={visibleRows} />
    </div>
  )
}
