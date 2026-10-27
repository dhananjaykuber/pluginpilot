import { AppLogo } from './AppLogo'
import { TopNav } from './TopNav'
import { UserAvatar } from '@/components/common/UserAvatar'

export function TopBar(): React.JSX.Element {
  return (
    <header className="flex h-12 shrink-0 items-center gap-6 bg-zinc-950 px-4 text-zinc-100">
      <AppLogo />
      <TopNav />
      <div className="ml-auto">
        <UserAvatar size="sm" />
      </div>
    </header>
  )
}
