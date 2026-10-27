import { GitPullRequestIcon } from 'lucide-react'
import type { UpdatePullRequest } from '@shared/types'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type PullRequestLinkProps = {
  pullRequest: UpdatePullRequest
}

export function PullRequestLink({ pullRequest }: PullRequestLinkProps): React.JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <a
            href={pullRequest.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
          />
        }
      >
        <GitPullRequestIcon className="size-4" />
        PR #{pullRequest.number}
      </TooltipTrigger>
      <TooltipContent>
        Open pull request from <code>{pullRequest.branch}</code>
      </TooltipContent>
    </Tooltip>
  )
}
