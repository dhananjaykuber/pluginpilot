import type { RepositorySummary } from '@shared/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRepositorySetup } from '@/hooks/useRepositorySetup'
import { getErrorMessage } from '@/lib/errors'
import { SetupSummary, SetupSummarySkeleton } from './SetupSummary'

type DetectedSetupCardProps = {
  repository: RepositorySummary
}

export function DetectedSetupCard({ repository }: DetectedSetupCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected setup</CardTitle>
        <CardDescription>
          {repository.fullName} · {repository.defaultBranch}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DetectedSetupContent repository={repository} />
      </CardContent>
    </Card>
  )
}

function DetectedSetupContent({ repository }: DetectedSetupCardProps): React.JSX.Element {
  const setup = useRepositorySetup(repository)

  if (setup.isPending) {
    return <SetupSummarySkeleton />
  }

  if (setup.isError) {
    return (
      <div className="flex items-center justify-between gap-4 text-sm">
        <p className="text-destructive">{getErrorMessage(setup.error)}</p>
        <Button variant="outline" size="sm" onClick={() => setup.refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  return <SetupSummary setup={setup.data} />
}
