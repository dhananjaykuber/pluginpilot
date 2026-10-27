import { AppLogo } from './AppLogo'
import { TopNav } from './TopNav'
import { UserMenu } from './UserMenu'

export function TopBar(): React.JSX.Element {
  return (
    <header className="flex h-12 shrink-0 items-center gap-6 bg-zinc-950 px-4 text-zinc-100">
      <AppLogo />
      <TopNav />
      <div className="ml-auto">
        <UserMenu />
      </div>
    </header>
  )
}
