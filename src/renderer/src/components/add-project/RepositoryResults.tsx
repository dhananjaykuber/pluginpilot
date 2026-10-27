import type { RepositorySummary } from '@shared/types'
import { Button } from '@/components/ui/button'
import { useProjects } from '@/hooks/useProjects'
import { useRepositories } from '@/hooks/useRepositories'
import { getErrorMessage } from '@/lib/errors'
import { filterAvailableRepositories } from '@/lib/repositories'
import { RepositoryList, RepositoryListSkeleton } from './RepositoryList'

type RepositoryResultsProps = {
  search: string
  selected: RepositorySummary | null
  onSelect: (repository: RepositorySummary) => void
}

export function RepositoryResults({
  search,
  selected,
  onSelect
}: RepositoryResultsProps): React.JSX.Element {
  const repositories = useRepositories()
  const projects = useProjects()

  if (repositories.isPending || projects.isPending) {
    return <RepositoryListSkeleton />
  }

  if (repositories.isError) {
    return (
      <ResultsMessage message={getErrorMessage(repositories.error)}>
        <Button variant="outline" size="sm" onClick={() => repositories.refetch()}>
          Try again
        </Button>
      </ResultsMessage>
    )
  }

  if (repositories.data.length === 0) {
    return <ResultsMessage message="No repositories found that your account can push to." />
  }

  const available = filterAvailableRepositories(repositories.data, projects.data ?? [], search)

  if (available.length === 0) {
    return <ResultsMessage message="No repositories match your search." />
  }

  return <RepositoryList repositories={available} selected={selected} onSelect={onSelect} />
}

type ResultsMessageProps = {
  message: string
  children?: React.ReactNode
}

function ResultsMessage({ message, children }: ResultsMessageProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
      {message}
      {children}
    </div>
  )
}
