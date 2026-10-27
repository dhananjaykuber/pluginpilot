import { CheckIcon, LockIcon } from 'lucide-react'
import type { RepositorySummary } from '@shared/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type RepositoryListItemProps = {
  repository: RepositorySummary
  selected: boolean
  onSelect: () => void
}

export function RepositoryListItem({
  repository,
  selected,
  onSelect
}: RepositoryListItemProps): React.JSX.Element {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/60',
        selected && 'bg-muted'
      )}
    >
      <Avatar size="sm">
        <AvatarImage src={repository.ownerAvatarUrl} alt="" />
        <AvatarFallback>{repository.owner.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1 truncate">
        <span className="text-muted-foreground">{repository.owner}/</span>
        <span className="font-medium">{repository.name}</span>
      </span>
      {repository.isPrivate && (
        <Badge variant="outline">
          <LockIcon data-icon="inline-start" />
          Private
        </Badge>
      )}
      {selected && <CheckIcon className="size-4 text-foreground" />}
    </button>
  )
}
