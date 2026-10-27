import { AppLogo } from './AppLogo'
import { TopNav } from './TopNav'
import { UserMenu } from './UserMenu'

export function TopBar(): React.JSX.Element {
  return (
    // The bottom border separates the bar from the page in dark mode, where both are near black.
    // It stays transparent in light mode so the bar keeps the same height in both themes.
    <header className="flex h-12 shrink-0 items-center gap-6 border-b border-transparent bg-zinc-950 px-4 text-zinc-100 dark:border-white/10">
      <AppLogo />
      <TopNav />
      <div className="ml-auto">
        <UserMenu />
      </div>
    </header>
  )
}
