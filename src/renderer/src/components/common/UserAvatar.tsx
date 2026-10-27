import { UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type UserAvatarProps = {
  src?: string
  name?: string
  size?: 'sm' | 'default' | 'lg'
}

export function UserAvatar({ src, name, size }: UserAvatarProps): React.JSX.Element {
  return (
    <Avatar size={size}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback>
        <UserIcon className="size-1/2" />
      </AvatarFallback>
    </Avatar>
  )
}
