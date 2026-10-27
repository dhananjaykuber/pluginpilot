import { useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
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
import { FieldError } from '@/components/common/FieldError'
import { useChangelog } from '@/hooks/useChangelog'
import { useLocalModifications } from '@/hooks/useLocalModifications'
import { useUpdatePlugin } from '@/hooks/useUpdatePlugin'
import { getErrorMessage } from '@/lib/errors'
import { queryKeys } from '@/lib/queryClient'
import type { NewPluginUpdate } from '@/lib/pluginUpdate'
import { LocalModificationsNotice } from './LocalModificationsNotice'
import { UpdateProgress } from './UpdateProgress'
import { UpdateResult } from './UpdateResult'
import { UpdateSummary } from './UpdateSummary'

type UpdatePluginDialogProps = {
  update: NewPluginUpdate
  baseBranch: string
  onClose: () => void
}

export function UpdatePluginDialog({
  update,
  baseBranch,
  onClose
}: UpdatePluginDialogProps): React.JSX.Element {
  const queryClient = useQueryClient()
  const updatePlugin = useUpdatePlugin()
  const changelog = useChangelog(update)
  const modifications = useLocalModifications(update)
  const [overwriteConfirmed, setOverwriteConfirmed] = useState(false)

  // Hand-made changes to the plugin files must be acknowledged before they're overwritten.
  const needsOverwriteConfirmation =
    modifications.data?.status === 'modified' && !overwriteConfirmed
  const canCreate = !changelog.isLoading && !modifications.isLoading && !needsOverwriteConfirmation

  function handleCreate(): void {
    updatePlugin.mutate(
      { ...update, changelog: changelog.data ?? [] },
      {
        onSuccess: (result) => toast.success(`Pull request #${result.pullRequestNumber} created`)
      }
    )
  }

  // The pull request list is refreshed on close rather than on success, because the row
  // swaps its Update button for the new pull request link, which would unmount this dialog.
  function handleClose(): void {
    if (updatePlugin.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectUpdatePullRequests(update.projectId)
      })
    }

    onClose()
  }

  // Closing mid-update would hide progress while GitHub is still being changed.
  function handleOpenChange(open: boolean): void {
    if (!open && !updatePlugin.isPending) {
      handleClose()
    }
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!updatePlugin.isPending} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update {update.name}</DialogTitle>
          <DialogDescription>
            Opens a pull request against the {update.environmentName} branch.
          </DialogDescription>
        </DialogHeader>

        <UpdateDialogBody
          update={update}
          baseBranch={baseBranch}
          updatePlugin={updatePlugin}
          changelog={changelog}
          modifications={modifications}
          overwriteConfirmed={overwriteConfirmed}
          onOverwriteConfirmedChange={setOverwriteConfirmed}
        />

        <FieldError message={updatePlugin.isError ? getErrorMessage(updatePlugin.error) : null} />

        <DialogFooter>
          {updatePlugin.isSuccess ? (
            <Button onClick={handleClose}>Done</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={handleClose} disabled={updatePlugin.isPending}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={updatePlugin.isPending || !canCreate}>
                {updatePlugin.isPending && (
                  <Loader2Icon data-icon="inline-start" className="animate-spin" />
                )}
                {updatePlugin.isError ? 'Try again' : 'Create pull request'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type UpdateDialogBodyProps = Omit<UpdatePluginDialogProps, 'onClose'> & {
  updatePlugin: ReturnType<typeof useUpdatePlugin>
  changelog: ReturnType<typeof useChangelog>
  modifications: ReturnType<typeof useLocalModifications>
  overwriteConfirmed: boolean
  onOverwriteConfirmedChange: (confirmed: boolean) => void
}

function UpdateDialogBody({
  update,
  baseBranch,
  updatePlugin,
  changelog,
  modifications,
  overwriteConfirmed,
  onOverwriteConfirmedChange
}: UpdateDialogBodyProps): React.JSX.Element {
  if (updatePlugin.isSuccess) {
    return <UpdateResult result={updatePlugin.data} />
  }

  if (updatePlugin.isPending) {
    return <UpdateProgress currentStep={updatePlugin.step} update={update} />
  }

  return (
    <>
      <UpdateSummary
        update={update}
        baseBranch={baseBranch}
        changelog={changelog.data}
        isChangelogLoading={changelog.isLoading}
      />
      <LocalModificationsNotice
        modifications={modifications.data}
        isChecking={modifications.isLoading}
        fromVersion={update.fromVersion}
        overwriteConfirmed={overwriteConfirmed}
        onOverwriteConfirmedChange={onOverwriteConfirmedChange}
      />
    </>
  )
}
