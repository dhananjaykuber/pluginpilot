import { Loader2Icon } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useBulkUpdate } from '@/hooks/useBulkUpdate'
import { pluralize } from '@/lib/format'
import type { NewPluginUpdate } from '@/lib/pluginUpdate'
import { queryKeys } from '@/lib/queryClient'
import { BulkUpdateList } from './BulkUpdateList'

type BulkUpdateDialogProps = {
  updates: NewPluginUpdate[]
  environmentName: string
  baseBranch: string
  onClose: (hasFinished: boolean) => void
}

export function BulkUpdateDialog({
  updates,
  environmentName,
  baseBranch,
  onClose
}: BulkUpdateDialogProps): React.JSX.Element {
  const queryClient = useQueryClient()
  const bulkUpdate = useBulkUpdate()
  const createdCount = Object.values(bulkUpdate.states).filter(
    (state) => state.status === 'created'
  ).length

  function handleClose(): void {
    if (bulkUpdate.hasFinished) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectUpdatePullRequests(updates[0].projectId)
      })
    }

    onClose(bulkUpdate.hasFinished)
  }

  // Closing mid-run would hide progress while GitHub is still being changed.
  function handleOpenChange(open: boolean): void {
    if (!open && !bulkUpdate.isRunning) {
      handleClose()
    }
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!bulkUpdate.isRunning} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create {pluralize(updates.length, 'pull request')}</DialogTitle>
          <DialogDescription>
            One pull request per plugin against {environmentName} (<code>{baseBranch}</code>),
            created one after another. Plugins with hand-made changes are skipped.
          </DialogDescription>
        </DialogHeader>

        <BulkUpdateList updates={updates} states={bulkUpdate.states} />

        {bulkUpdate.hasFinished && (
          <p className="text-sm text-muted-foreground">
            Created {pluralize(createdCount, 'pull request')} of {updates.length}.
          </p>
        )}

        <DialogFooter>
          {bulkUpdate.hasFinished ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={handleClose} disabled={bulkUpdate.isRunning}>
                Cancel
              </Button>
              <Button onClick={() => bulkUpdate.run(updates)} disabled={bulkUpdate.isRunning}>
                {bulkUpdate.isRunning && (
                  <Loader2Icon data-icon="inline-start" className="animate-spin" />
                )}
                Create {pluralize(updates.length, 'pull request')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
