import { Link } from 'react-router'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/common/FieldError'

type FormActionsProps = {
  saveLabel: string
  cancelTo: string
  disabled: boolean
  isSaving: boolean
  error: string | null
  onSave: () => void
}

export function FormActions({
  saveLabel,
  cancelTo,
  disabled,
  isSaving,
  error,
  onSave
}: FormActionsProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" render={<Link to={cancelTo} />} nativeButton={false}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={disabled || isSaving}>
          {isSaving && <Loader2Icon data-icon="inline-start" className="animate-spin" />}
          {saveLabel}
        </Button>
      </div>
      <div className="text-right">
        <FieldError message={error} />
      </div>
    </div>
  )
}
