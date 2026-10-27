import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldError } from '@/components/common/FieldError'
import type { EnvironmentDraft } from '@/lib/projectForm'
import { EnvironmentRow } from './EnvironmentRow'

type EnvironmentsCardProps = {
  environments: EnvironmentDraft[]
  branches: string[]
  error: string | null
  rowErrors: Record<string, string>
  onAdd: () => void
  onChange: (id: string, changes: Partial<Omit<EnvironmentDraft, 'id'>>) => void
  onRemove: (id: string) => void
}

export function EnvironmentsCard({
  environments,
  branches,
  error,
  rowErrors,
  onAdd,
  onChange,
  onRemove
}: EnvironmentsCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environments</CardTitle>
        <CardDescription>
          Update pull requests are opened against the branch of the selected environment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {environments.length > 0 && (
          <div className="grid grid-cols-[1fr_1fr_2rem] gap-2 text-xs font-medium text-muted-foreground">
            <span>Name</span>
            <span>Branch</span>
          </div>
        )}
        {environments.map((environment) => (
          <EnvironmentRow
            key={environment.id}
            environment={environment}
            branches={branches}
            error={rowErrors[environment.id]}
            onChange={(changes) => onChange(environment.id, changes)}
            onRemove={() => onRemove(environment.id)}
          />
        ))}
        <FieldError message={error} />
        <Button variant="outline" size="sm" onClick={onAdd}>
          <PlusIcon data-icon="inline-start" />
          Add environment
        </Button>
      </CardContent>
    </Card>
  )
}
