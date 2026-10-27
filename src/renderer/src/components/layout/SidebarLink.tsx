import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import type { NavItem } from './navItems'

type SidebarLinkProps = {
  item: NavItem
  active: boolean
}

export function SidebarLink({ item, active }: SidebarLinkProps): React.JSX.Element {
  const Icon = item.icon

  return (
    <Link
      to={item.to}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        active && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
      )}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  )
}
