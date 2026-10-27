import { ListIcon } from 'lucide-react'
import { SearchInput } from '@/components/common/SearchInput'
import { formatRelativeTime, pluralize } from '@/lib/format'

type PluginsToolbarProps = {
  search: string
  onSearchChange: (search: string) => void
  totalCount: number
  scannedAt: string
}

export function PluginsToolbar({
  search,
  onSearchChange,
  totalCount,
  scannedAt
}: PluginsToolbarProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="flex items-center gap-2 text-sm">
        <ListIcon className="size-4 text-muted-foreground" />
        <span className="font-semibold">Showing {pluralize(totalCount, 'installed plugin')}</span>
        <span className="text-muted-foreground">· scanned {formatRelativeTime(scannedAt)}</span>
      </p>
      <div className="w-64">
        <SearchInput value={search} onChange={onSearchChange} placeholder="Search plugins…" />
      </div>
    </div>
  )
}
