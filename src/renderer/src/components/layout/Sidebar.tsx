import { Separator } from '@/components/ui/separator'
import { useActiveSection } from '@/hooks/useActiveSection'
import { navItems } from './navItems'
import { SidebarLink } from './SidebarLink'
import { SidebarProfile } from './SidebarProfile'

export function Sidebar(): React.JSX.Element {
  const activeSection = useActiveSection()

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <SidebarProfile />
      <Separator />
      <nav className="flex flex-col gap-0.5 p-3">
        {navItems.map((item) => (
          <SidebarLink key={item.section} item={item} active={item.section === activeSection} />
        ))}
      </nav>
    </aside>
  )
}
