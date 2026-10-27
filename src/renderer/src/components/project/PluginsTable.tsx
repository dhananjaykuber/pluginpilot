import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { PluginListItem } from '@/lib/plugins'
import type { UpdateTarget } from '@/lib/pluginUpdate'
import type { PluginSelection } from '@/hooks/usePluginSelection'
import { PluginRow } from './PluginRow'

type PluginsTableProps = {
  plugins: PluginListItem[]
  target: UpdateTarget
  selection: PluginSelection
  // Plugins that can be selected for bulk pull requests.
  selectableSlugs: Set<string>
}

export function PluginsTable({
  plugins,
  target,
  selection,
  selectableSlugs
}: PluginsTableProps): React.JSX.Element {
  const visibleSelectable = plugins
    .map((plugin) => plugin.slug)
    .filter((slug) => selectableSlugs.has(slug))
  const selectedCount = visibleSelectable.filter((slug) => selection.isSelected(slug)).length
  const allSelected = visibleSelectable.length > 0 && selectedCount === visibleSelectable.length

  return (
    <PluginsTableFrame
      selectAll={
        <Checkbox
          aria-label="Select all plugins with updates"
          checked={allSelected}
          indeterminate={selectedCount > 0 && !allSelected}
          disabled={visibleSelectable.length === 0}
          onCheckedChange={() => selection.toggleAll(visibleSelectable)}
        />
      }
    >
      {plugins.map((plugin) => (
        <PluginRow
          key={`${plugin.source}:${plugin.path}`}
          plugin={plugin}
          target={target}
          isSelectable={selectableSlugs.has(plugin.slug)}
          isSelected={selection.isSelected(plugin.slug)}
          onToggle={() => selection.toggle(plugin.slug)}
        />
      ))}
    </PluginsTableFrame>
  )
}

export function PluginsTableSkeleton(): React.JSX.Element {
  return (
    <PluginsTableFrame>
      {Array.from({ length: 6 }, (_, index) => (
        <TableRow key={index}>
          <TableCell />
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
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell />
        </TableRow>
      ))}
    </PluginsTableFrame>
  )
}

type PluginsTableFrameProps = {
  children: React.ReactNode
  selectAll?: React.ReactNode
}

function PluginsTableFrame({ children, selectAll }: PluginsTableFrameProps): React.JSX.Element {
  return (
    <Table className="rounded-lg bg-card">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">{selectAll}</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="w-32">Source</TableHead>
          <TableHead className="w-56">Version</TableHead>
          <TableHead className="w-44">Known Vulnerabilities</TableHead>
          <TableHead className="w-32">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  )
}
