import { CircleCheckIcon, FileWarningIcon, Loader2Icon } from 'lucide-react'
import type { PluginFileChange, PluginModifications } from '@shared/types'
import { Checkbox } from '@/components/ui/checkbox'
import { pluralize } from '@/lib/format'

const VISIBLE_CHANGES = 8

const changeLabels: Record<PluginFileChange['kind'], string> = {
  modified: 'Modified',
  added: 'Added',
  removed: 'Removed'
}

type LocalModificationsNoticeProps = {
  modifications: PluginModifications | undefined
  isChecking: boolean
  fromVersion: string
  overwriteConfirmed: boolean
  onOverwriteConfirmedChange: (confirmed: boolean) => void
}

export function LocalModificationsNotice({
  modifications,
  isChecking,
  fromVersion,
  overwriteConfirmed,
  onOverwriteConfirmedChange
}: LocalModificationsNoticeProps): React.JSX.Element | null {
  if (isChecking) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Checking the plugin files for local changes…
      </p>
    )
  }

  if (!modifications) {
    return null
  }

  if (modifications.status === 'unknown') {
    return (
      <p className="text-sm text-muted-foreground">
        Couldn&apos;t compare with the original {fromVersion} from WordPress.org, so local changes
        weren&apos;t checked.
      </p>
    )
  }

  if (modifications.status === 'unmodified') {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <CircleCheckIcon className="size-4 text-emerald-600 dark:text-emerald-500" />
        No local changes. The plugin files match the original {fromVersion}.
      </p>
    )
  }

  const hiddenCount = modifications.totalChanges - VISIBLE_CHANGES

  return (
    <div className="space-y-2 rounded-lg border border-amber-500/40 bg-amber-50 p-3 text-sm dark:bg-amber-950/40">
      <p className="flex items-center gap-2 font-medium text-amber-800 dark:text-amber-300">
        <FileWarningIcon className="size-4" />
        {pluralize(modifications.totalChanges, 'file differs', 'files differ')} from the original{' '}
        {fromVersion}
      </p>
      <ul className="space-y-0.5 font-mono text-xs">
        {modifications.changes.slice(0, VISIBLE_CHANGES).map((change) => (
          <li key={change.path}>
            <span className="text-muted-foreground">{changeLabels[change.kind]}:</span>{' '}
            {change.path}
          </li>
        ))}
        {hiddenCount > 0 && <li className="text-muted-foreground">and {hiddenCount} more</li>}
      </ul>
      <label className="flex items-center gap-2">
        <Checkbox
          checked={overwriteConfirmed}
          onCheckedChange={(checked) => onOverwriteConfirmedChange(checked === true)}
        />
        Update anyway and overwrite these changes
      </label>
    </div>
  )
}
