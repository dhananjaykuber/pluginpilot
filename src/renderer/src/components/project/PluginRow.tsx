import { PackageIcon } from 'lucide-react'
import { isMajorUpdate } from '@shared/versions'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { pluginSourceLabels, shortenPluginName, type PluginListItem } from '@/lib/plugins'
import type { UpdateTarget } from '@/lib/pluginUpdate'
import { PluginAction } from './PluginAction'
import { VulnerabilityBadge } from './VulnerabilityBadge'

type PluginRowProps = {
  plugin: PluginListItem
  target: UpdateTarget
  isSelectable: boolean
  isSelected: boolean
  onToggle: () => void
}

export function PluginRow({
  plugin,
  target,
  isSelectable,
  isSelected,
  onToggle
}: PluginRowProps): React.JSX.Element {
  return (
    <TableRow data-state={isSelected ? 'selected' : undefined}>
      <TableCell>
        {isSelectable && (
          <Checkbox
            aria-label={`Select ${plugin.displayName}`}
            checked={isSelected}
            onCheckedChange={onToggle}
          />
        )}
      </TableCell>
      <TableCell>
        <p className="font-medium" title={plugin.displayName}>
          {shortenPluginName(plugin.displayName)}
        </p>
        <p className="font-mono text-xs text-muted-foreground">{plugin.path}</p>
      </TableCell>
      <TableCell>
        <Badge variant={plugin.source === 'composer' ? 'secondary' : 'outline'}>
          {pluginSourceLabels[plugin.source]}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-mono text-sm">
            {plugin.version ?? <span className="text-muted-foreground">Unknown</span>}
          </span>
          {plugin.availableVersion && (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {plugin.availableVersion} Available
            </Badge>
          )}
          {plugin.version &&
            plugin.availableVersion &&
            isMajorUpdate(plugin.version, plugin.availableVersion) && (
              <Badge
                variant="outline"
                className="border-amber-500/50 text-amber-700 dark:text-amber-400"
              >
                Major
              </Badge>
            )}
          <ReleaseSourceLabel plugin={plugin} />
        </div>
      </TableCell>
      <TableCell>
        {plugin.vulnerabilities?.length ? (
          <VulnerabilityBadge vulnerabilities={plugin.vulnerabilities} />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <PluginAction plugin={plugin} target={target} />
      </TableCell>
    </TableRow>
  )
}

// Only shown when the update doesn't come from WordPress.org, the usual source. Committed
// plugins can also get their latest version from rtCamp packages, but they're still updated
// from an uploaded zip, so they're only labelled as not being on WordPress.org.
function ReleaseSourceLabel({ plugin }: { plugin: PluginListItem }): React.JSX.Element | null {
  if (plugin.releaseSource === 'rtcamp' && plugin.source === 'composer') {
    return (
      <Badge variant="outline" title="Latest version from packages.rtcamp.workers.dev">
        <PackageIcon data-icon="inline-start" />
        rtCamp packages
      </Badge>
    )
  }

  if (plugin.isOnWordPressOrg === false) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Not on WordPress.org
      </Badge>
    )
  }

  return null
}
