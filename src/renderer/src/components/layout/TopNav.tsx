import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import { useActiveSection } from '@/hooks/useActiveSection'
import { navItems } from './navItems'

export function TopNav(): React.JSX.Element {
  const activeSection = useActiveSection()

  return (
    <nav className="flex h-full items-stretch">
      {navItems.map((item) => (
        <Link
          key={item.section}
          to={item.to}
          className={cn(
            'relative flex items-center px-3 text-sm text-zinc-400 transition-colors hover:text-white',
            item.section === activeSection &&
              'text-white after:absolute after:inset-x-3 after:top-0 after:h-0.5 after:bg-white'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
