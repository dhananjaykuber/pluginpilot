import { useNavigate } from 'react-router'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import type { Project } from '@shared/types'
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
import { useDeleteProject } from '@/hooks/useProjectMutations'
import { getErrorMessage } from '@/lib/errors'
import { paths } from '@/lib/paths'

type DeleteProjectDialogProps = {
  project: Project
  onClose: () => void
}

export function DeleteProjectDialog({
  project,
  onClose
}: DeleteProjectDialogProps): React.JSX.Element {
  const navigate = useNavigate()
  const deleteProject = useDeleteProject()
  const fullName = `${project.repo.owner}/${project.repo.name}`

  function handleDelete(): void {
    deleteProject.mutate(project.id, {
      onSuccess: () => {
        toast.success(`${fullName} removed`)
        navigate(paths.projects)
      }
    })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && !deleteProject.isPending && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {fullName}?</DialogTitle>
          <DialogDescription>
            The project and its environments are removed from PluginPilot. You can add the
            repository again at any time.
          </DialogDescription>
        </DialogHeader>
        <FieldError message={deleteProject.isError ? getErrorMessage(deleteProject.error) : null} />
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={deleteProject.isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteProject.isPending}>
            {deleteProject.isPending && (
              <Loader2Icon data-icon="inline-start" className="animate-spin" />
            )}
            Delete project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
