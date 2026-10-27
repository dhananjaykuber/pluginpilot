import { Link } from 'react-router'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/common/FieldError'
import { paths } from '@/lib/paths'

type AddProjectActionsProps = {
  disabled: boolean
  isSaving: boolean
  error: string | null
  onSave: () => void
}

export function AddProjectActions({
  disabled,
  isSaving,
  error,
  onSave
}: AddProjectActionsProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" render={<Link to={paths.projects} />} nativeButton={false}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={disabled || isSaving}>
          {isSaving && <Loader2Icon data-icon="inline-start" className="animate-spin" />}
          Add Project
        </Button>
      </div>
      <div className="text-right">
        <FieldError message={error} />
      </div>
    </div>
  )
}
