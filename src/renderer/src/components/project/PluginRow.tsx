import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { pluginSourceLabels, type PluginListItem } from '@/lib/plugins'
import type { UpdateTarget } from '@/lib/pluginUpdate'
import { PluginAction } from './PluginAction'
import { VulnerabilityBadge } from './VulnerabilityBadge'

type PluginRowProps = {
  plugin: PluginListItem
  target: UpdateTarget
}

export function PluginRow({ plugin, target }: PluginRowProps): React.JSX.Element {
  return (
    <TableRow>
      <TableCell>
        <p className="font-medium">{plugin.displayName}</p>
        <p className="font-mono text-xs text-muted-foreground">{plugin.path}</p>
      </TableCell>
      <TableCell>
        <Badge variant={plugin.source === 'composer' ? 'secondary' : 'outline'}>
          {pluginSourceLabels[plugin.source]}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">
            {plugin.version ?? <span className="text-muted-foreground">Unknown</span>}
          </span>
          {plugin.availableVersion && (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {plugin.availableVersion} Available
            </Badge>
          )}
          {plugin.isOnWordPressOrg === false && (
            <span className="text-xs text-muted-foreground">Not on WordPress.org</span>
          )}
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
