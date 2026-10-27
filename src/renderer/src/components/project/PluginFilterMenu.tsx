import { ChevronDownIcon, ListFilterIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  getPluginFilter,
  pluginFilters,
  type PluginFilter,
  type PluginListItem
} from '@/lib/plugins'

type PluginFilterMenuProps = {
  value: PluginFilter
  onChange: (filter: PluginFilter) => void
  plugins: PluginListItem[]
}

export function PluginFilterMenu({
  value,
  onChange,
  plugins
}: PluginFilterMenuProps): React.JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <ListFilterIcon data-icon="inline-start" />
        Filter: {getPluginFilter(value).label}
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(filter) => onChange(filter as PluginFilter)}
        >
          {pluginFilters.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              <span className="flex-1">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {plugins.filter(option.matches).length}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
