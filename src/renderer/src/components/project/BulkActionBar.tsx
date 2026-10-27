import { useState } from 'react'
import { GitPullRequestArrowIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BulkUpdateDialog } from '@/components/plugin-update/BulkUpdateDialog'
import type { NewPluginUpdate, UpdateTarget } from '@/lib/pluginUpdate'

type BulkActionBarProps = {
  updates: NewPluginUpdate[]
  target: UpdateTarget
  onClear: () => void
}

export function BulkActionBar({
  updates,
  target,
  onClear
}: BulkActionBarProps): React.JSX.Element | null {
  // A snapshot of the selection, so plugins that get a pull request during the run don't
  // drop out of the dialog when the pull request list refreshes.
  const [dialogUpdates, setDialogUpdates] = useState<NewPluginUpdate[] | null>(null)

  // Once the run is done, the created PRs replace the checkboxes, so start a fresh selection.
  function handleDialogClose(hasFinished: boolean): void {
    setDialogUpdates(null)

    if (hasFinished) {
      onClear()
    }
  }

  if (updates.length === 0 && !dialogUpdates) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-background px-4 py-2">
      <p className="text-sm font-medium">{updates.length} selected</p>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
        <Button size="sm" onClick={() => setDialogUpdates(updates)}>
          <GitPullRequestArrowIcon data-icon="inline-start" />
          Create {updates.length} PRs
        </Button>
      </div>
      {dialogUpdates && (
        <BulkUpdateDialog
          updates={dialogUpdates}
          environmentName={target.environment.name}
          baseBranch={target.environment.branch}
          onClose={handleDialogClose}
        />
      )}
    </div>
  )
}
