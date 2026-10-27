import { Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldError } from '@/components/common/FieldError'
import type { EnvironmentDraft } from '@/lib/projectForm'
import { BranchSelect } from './BranchSelect'

type EnvironmentRowProps = {
  environment: EnvironmentDraft
  branches: string[]
  error: string | undefined
  onChange: (changes: Partial<Omit<EnvironmentDraft, 'id'>>) => void
  onRemove: () => void
}

export function EnvironmentRow({
  environment,
  branches,
  error,
  onChange,
  onRemove
}: EnvironmentRowProps): React.JSX.Element {
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[1fr_1fr_2rem] items-center gap-2">
        <Input
          value={environment.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="e.g. Staging"
          aria-label="Environment name"
          aria-invalid={!!error}
        />
        <BranchSelect
          value={environment.branch}
          branches={branches}
          onChange={(branch) => onChange({ branch })}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label={`Remove ${environment.name || 'environment'}`}
        >
          <Trash2Icon />
        </Button>
      </div>
      <FieldError message={error} />
    </div>
  )
}
