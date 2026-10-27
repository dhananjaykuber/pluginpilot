import { LogOutIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/common/UserAvatar'
import { useGitHubUser } from '@/hooks/useGitHubUser'
import { useDisconnectGitHub } from '@/hooks/useDisconnectGitHub'

export function UserMenu(): React.JSX.Element | null {
  const { data: user } = useGitHubUser()
  const disconnect = useDisconnectGitHub()

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <UserAvatar src={user.avatarUrl} name={user.name} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block text-sm text-foreground">{user.name}</span>
            <span className="block font-normal">@{user.login}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect.mutate()}>
          <LogOutIcon />
          Disconnect GitHub
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
