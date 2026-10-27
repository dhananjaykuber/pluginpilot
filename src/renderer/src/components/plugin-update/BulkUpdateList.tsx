import {
  ArrowRightIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleMinusIcon,
  CircleXIcon,
  Loader2Icon
} from 'lucide-react'
import { isMajorUpdate } from '@shared/versions'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from '@/components/common/ExternalLink'
import type { BulkItemState } from '@/hooks/useBulkUpdate'
import { getUpdateStepLabel, type NewPluginUpdate } from '@/lib/pluginUpdate'

type BulkUpdateListProps = {
  updates: NewPluginUpdate[]
  states: Record<string, BulkItemState>
}

export function BulkUpdateList({ updates, states }: BulkUpdateListProps): React.JSX.Element {
  return (
    <ul className="max-h-80 divide-y overflow-y-auto rounded-lg border">
      {updates.map((update) => (
        <li key={update.slug} className="space-y-1 px-3 py-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex-1 font-medium">{update.name}</span>
            <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
              {update.fromVersion}
              <ArrowRightIcon className="size-3" />
              {update.toVersion}
            </span>
            {isMajorUpdate(update.fromVersion, update.toVersion) && (
              <Badge variant="outline" className="text-amber-700 dark:text-amber-400">
                Major
              </Badge>
            )}
            {update.securityFixes.length > 0 && (
              <Badge variant="outline" className="text-orange-700 dark:text-orange-400">
                Security
              </Badge>
            )}
          </div>
          <ItemStatus update={update} state={states[update.slug]} />
        </li>
      ))}
    </ul>
  )
}

function ItemStatus({
  update,
  state
}: {
  update: NewPluginUpdate
  state: BulkItemState | undefined
}): React.JSX.Element | null {
  if (!state) {
    return null
  }

  switch (state.status) {
    case 'queued':
      return (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CircleDashedIcon className="size-3.5" />
          Waiting
        </p>
      )
    case 'running':
      return (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2Icon className="size-3.5 animate-spin" />
          {state.step ? getUpdateStepLabel(state.step, update) : 'Checking the plugin files'}
        </p>
      )
    case 'created':
      return (
        <p className="flex items-center gap-1.5 text-xs">
          <CircleCheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-500" />
          <ExternalLink href={state.result.pullRequestUrl}>
            Pull request #{state.result.pullRequestNumber}
          </ExternalLink>
        </p>
      )
    case 'skipped':
      return (
        <p className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
          <CircleMinusIcon className="size-3.5 shrink-0" />
          Skipped: {state.reason}
        </p>
      )
    case 'failed':
      return (
        <p className="flex items-center gap-1.5 text-xs text-destructive">
          <CircleXIcon className="size-3.5 shrink-0" />
          {state.error}
        </p>
      )
  }
}
