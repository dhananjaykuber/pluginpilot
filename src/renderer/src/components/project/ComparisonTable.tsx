import type { Environment } from '@shared/types'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { ComparisonCell, ComparisonRow, ComparisonStatus } from '@/lib/environmentComparison'
import { getEnvironmentColor } from '@/lib/environments'
import { cn } from '@/lib/utils'

const cellClasses: Record<ComparisonStatus, string> = {
  same: '',
  newest: 'font-semibold text-emerald-700 dark:text-emerald-400',
  behind: 'text-amber-700 dark:text-amber-400',
  missing: 'text-muted-foreground'
}

type ComparisonTableProps = {
  environments: Environment[]
  rows: ComparisonRow[]
}

export function ComparisonTable({ environments, rows }: ComparisonTableProps): React.JSX.Element {
  return (
    <Table className="rounded-lg bg-card">
      <TableHeader>
        <TableRow>
          <TableHead>Plugin</TableHead>
          {environments.map((environment) => (
            <TableHead key={environment.name}>
              <span className="flex items-center gap-2">
                <span
                  className={cn('size-2 rounded-full', getEnvironmentColor(environment.name).dot)}
                />
                {environment.name}
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  {environment.branch}
                </span>
              </span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.slug}
            className={cn(row.differs && 'bg-amber-50/60 dark:bg-amber-950/20')}
          >
            <TableCell className="font-medium">{row.name}</TableCell>
            {row.cells.map((cell, index) => (
              <TableCell key={environments[index].name}>
                <VersionCell cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function VersionCell({ cell }: { cell: ComparisonCell | null }): React.JSX.Element {
  if (!cell) {
    return <Skeleton className="h-4 w-12" />
  }

  if (cell.status === 'missing') {
    return <span className={cellClasses.missing}>Not installed</span>
  }

  return (
    <span className={cn('font-mono text-sm', cellClasses[cell.status])}>
      {cell.version ?? 'Unknown'}
    </span>
  )
}
