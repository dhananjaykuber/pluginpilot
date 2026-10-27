import { UserAvatar } from '@/components/common/UserAvatar'

export function SidebarProfile(): React.JSX.Element {
  return (
    <section className="space-y-3 p-4">
      <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        User profile
      </h2>
      <UserAvatar size="lg" />
      <div>
        <p className="text-sm font-semibold">Not connected</p>
        <p className="text-xs text-muted-foreground">Connect your GitHub account</p>
      </div>
    </section>
  )
}
