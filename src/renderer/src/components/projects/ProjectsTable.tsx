import { Link } from 'react-router'
import type { Project } from '@shared/types'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { paths } from '@/lib/paths'

type ProjectsTableProps = {
  projects: Project[]
}

export function ProjectsTable({ projects }: ProjectsTableProps): React.JSX.Element {
  return (
    <Table className="rounded-lg bg-background">
      <TableHeader>
        <TableRow>
          <TableHead>Repository</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Environments</TableHead>
          <TableHead>Added</TableHead>
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
                {project.environments.map((environment) => (
                  <Badge key={environment.name} variant="secondary">
                    {environment.name}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(project.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
