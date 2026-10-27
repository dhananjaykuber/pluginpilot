import { UserAvatar } from '@/components/common/UserAvatar'
import { useGitHubUser } from '@/hooks/useGitHubUser'

export function SidebarProfile(): React.JSX.Element | null {
  const { data: user } = useGitHubUser()

  if (!user) {
    return null
  }

  return (
    <section className="space-y-3 p-4">
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        User profile
      </h2>
      <UserAvatar src={user.avatarUrl} name={user.name} size="lg" />
      <div>
        <p className="text-sm font-semibold">{user.name}</p>
        <p className="text-xs text-muted-foreground">@{user.login}</p>
      </div>
    </section>
  )
}
