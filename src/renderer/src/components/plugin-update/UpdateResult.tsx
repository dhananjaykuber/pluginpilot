import { CircleCheckIcon } from 'lucide-react'
import type { PluginUpdateResult } from '@shared/types'
import { ExternalLink } from '@/components/common/ExternalLink'

type UpdateResultProps = {
  result: PluginUpdateResult
}

export function UpdateResult({ result }: UpdateResultProps): React.JSX.Element {
  return (
    <div className="space-y-2 text-sm">
      <p className="flex items-center gap-2 font-medium">
        <CircleCheckIcon className="size-4 text-emerald-600 dark:text-emerald-500" />
        Pull request #{result.pullRequestNumber} created
      </p>
      <p className="text-muted-foreground">
        Branch <code>{result.branch}</code> is ready for review.{' '}
        <ExternalLink href={result.pullRequestUrl}>View pull request</ExternalLink>
      </p>
    </div>
  )
}
