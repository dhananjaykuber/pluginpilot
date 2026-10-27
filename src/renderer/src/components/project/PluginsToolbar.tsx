import { ListIcon } from 'lucide-react'
import { SearchInput } from '@/components/common/SearchInput'
import { formatRelativeTime, pluralize } from '@/lib/format'

type PluginsToolbarProps = {
  search: string
  onSearchChange: (search: string) => void
  visibleCount: number
  totalCount: number
  scannedAt: string
  filterMenu: React.ReactNode
}

export function PluginsToolbar({
  search,
  onSearchChange,
  visibleCount,
  totalCount,
  scannedAt,
  filterMenu
}: PluginsToolbarProps): React.JSX.Element {
  const summary =
    visibleCount === totalCount
      ? `Showing ${pluralize(totalCount, 'installed plugin')}`
      : `Showing ${visibleCount} of ${pluralize(totalCount, 'installed plugin')}`

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="flex items-center gap-2 text-sm">
        <ListIcon className="size-4 text-muted-foreground" />
        <span className="font-semibold">{summary}</span>
        <span className="text-muted-foreground">· scanned {formatRelativeTime(scannedAt)}</span>
      </p>
      <div className="flex items-center gap-2">
        {filterMenu}
        <div className="w-64">
          <SearchInput value={search} onChange={onSearchChange} placeholder="Search plugins…" />
        </div>
      </div>
    </div>
  )
}
