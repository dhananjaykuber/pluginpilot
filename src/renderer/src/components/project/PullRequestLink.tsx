import {
  CircleCheckIcon,
  CircleXIcon,
  GitPullRequestIcon,
  Loader2Icon,
  type LucideIcon
} from 'lucide-react'
import type { ChecksStatus, ReviewStatus, UpdatePullRequest } from '@shared/types'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const checksDisplay: Record<
  Exclude<ChecksStatus, 'none'>,
  { icon: LucideIcon; label: string; className: string }
> = {
  passing: {
    icon: CircleCheckIcon,
    label: 'Checks passing',
    className: 'text-emerald-600 dark:text-emerald-400'
  },
  failing: { icon: CircleXIcon, label: 'Checks failing', className: 'text-destructive' },
  pending: {
    icon: Loader2Icon,
    label: 'Checks running',
    className: 'animate-spin text-amber-600 dark:text-amber-400'
  }
}

const reviewDisplay: Record<
  Exclude<ReviewStatus, 'pending'>,
  { label: string; className: string }
> = {
  approved: { label: 'Approved', className: 'text-emerald-700 dark:text-emerald-400' },
  'changes-requested': { label: 'Changes requested', className: 'text-destructive' }
}

type PullRequestLinkProps = {
  pullRequest: UpdatePullRequest
}

export function PullRequestLink({ pullRequest }: PullRequestLinkProps): React.JSX.Element {
  const checks = pullRequest.checks === 'none' ? null : checksDisplay[pullRequest.checks]
  const review = pullRequest.review === 'pending' ? null : reviewDisplay[pullRequest.review]
  const ChecksIcon = checks?.icon

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <a
            href={pullRequest.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-col items-start gap-0.5 text-sm underline-offset-4 hover:underline"
          />
        }
      >
        <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
          <GitPullRequestIcon className="size-4" />
          PR #{pullRequest.number}
          {ChecksIcon && <ChecksIcon className={cn('size-3.5', checks.className)} />}
        </span>
        {review && <span className={cn('text-xs', review.className)}>{review.label}</span>}
      </TooltipTrigger>
      <TooltipContent className="block space-y-0.5">
        <p>
          Open pull request from <code>{pullRequest.branch}</code>
        </p>
        <p>{checks?.label ?? 'No checks'}</p>
        <p>{review?.label ?? 'Waiting for review'}</p>
      </TooltipContent>
    </Tooltip>
  )
}
