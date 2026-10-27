import type { InstalledPlugin } from '@shared/types'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { pluginSourceLabels } from '@/lib/plugins'

type PluginRowProps = {
  plugin: InstalledPlugin
}

export function PluginRow({ plugin }: PluginRowProps): React.JSX.Element {
  return (
    <TableRow>
      <TableCell>
        <p className="font-medium">{plugin.name}</p>
        <p className="font-mono text-xs text-muted-foreground">{plugin.path}</p>
      </TableCell>
      <TableCell>
        <Badge variant={plugin.source === 'composer' ? 'secondary' : 'outline'}>
          {pluginSourceLabels[plugin.source]}
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-sm">
        {plugin.version ?? <span className="text-muted-foreground">Unknown</span>}
      </TableCell>
    </TableRow>
  )
}
