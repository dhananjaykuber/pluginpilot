import type { InstalledPlugin } from '@shared/types'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { PluginRow } from './PluginRow'

type PluginsTableProps = {
  plugins: InstalledPlugin[]
}

export function PluginsTable({ plugins }: PluginsTableProps): React.JSX.Element {
  return (
    <PluginsTableFrame>
      {plugins.map((plugin) => (
        <PluginRow key={`${plugin.source}:${plugin.path}`} plugin={plugin} />
      ))}
    </PluginsTableFrame>
  )
}

export function PluginsTableSkeleton(): React.JSX.Element {
  return (
    <PluginsTableFrame>
      {Array.from({ length: 6 }, (_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="mb-1.5 h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-12" />
          </TableCell>
        </TableRow>
      ))}
    </PluginsTableFrame>
  )
}

function PluginsTableFrame({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <Table className="rounded-lg bg-background">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="w-32">Source</TableHead>
          <TableHead className="w-40">Version</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  )
}
