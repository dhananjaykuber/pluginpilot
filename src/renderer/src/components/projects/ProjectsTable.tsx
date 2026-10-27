import { Link } from 'react-router'
import type { Project, ScanSummary } from '@shared/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useScanSummaries } from '@/hooks/useScanSummaries'
import { sortEnvironments } from '@/lib/environments'
import { formatRelativeTime } from '@/lib/format'
import { paths } from '@/lib/paths'
import { EnvironmentBadge } from './EnvironmentBadge'

type ProjectsTableProps = {
  projects: Project[]
}

export function ProjectsTable({ projects }: ProjectsTableProps): React.JSX.Element {
  const { data: summaries = {} } = useScanSummaries()

  return (
    <Table className="rounded-lg bg-card">
      <TableHeader>
        <TableRow>
          <TableHead>Repository</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Environments</TableHead>
          <TableHead>Last scanned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">
              <Link to={paths.project(project.id)} className="underline-offset-4 hover:underline">
                {project.repo.name}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">{project.repo.owner}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {sortEnvironments(project.environments).map((environment) => (
                  <EnvironmentBadge
                    key={environment.name}
                    projectId={project.id}
                    name={environment.name}
                    branch={environment.branch}
                    summary={summaries[project.id]?.[environment.name]}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatLastScanned(Object.values(summaries[project.id] ?? {}))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function formatLastScanned(summaries: ScanSummary[]): string {
  const latest = summaries
    .map((summary) => summary.scannedAt)
    .sort()
    .at(-1)
  return latest ? formatRelativeTime(latest) : 'Not scanned yet'
}
