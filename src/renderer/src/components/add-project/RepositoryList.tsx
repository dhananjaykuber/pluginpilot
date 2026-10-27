import type { RepositorySummary } from '@shared/types'
import { Skeleton } from '@/components/ui/skeleton'
import { RepositoryListItem } from './RepositoryListItem'

type RepositoryListProps = {
  repositories: RepositorySummary[]
  selected: RepositorySummary | null
  onSelect: (repository: RepositorySummary) => void
}

export function RepositoryList({
  repositories,
  selected,
  onSelect
}: RepositoryListProps): React.JSX.Element {
  return (
    <div
      role="radiogroup"
      aria-label="Repositories"
      className="max-h-80 divide-y overflow-y-auto rounded-lg border"
    >
      {repositories.map((repository) => (
        <RepositoryListItem
          key={repository.fullName}
          repository={repository}
          selected={repository.fullName === selected?.fullName}
          onSelect={() => onSelect(repository)}
        />
      ))}
    </div>
  )
}

export function RepositoryListSkeleton(): React.JSX.Element {
  return (
    <div className="divide-y rounded-lg border">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 px-3 py-2.5">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      ))}
    </div>
  )
}
