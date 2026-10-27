import type { Environment } from '@shared/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type EnvironmentSelectProps = {
  environments: Environment[]
  value: Environment
  onChange: (name: string) => void
}

export function EnvironmentSelect({
  environments,
  value,
  onChange
}: EnvironmentSelectProps): React.JSX.Element {
  return (
    <Select value={value.name} onValueChange={(name) => name && onChange(name)}>
      <SelectTrigger className="min-w-56" aria-label="Environment">
        <SelectValue>{() => <EnvironmentLabel environment={value} />}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {environments.map((environment) => (
          <SelectItem key={environment.name} value={environment.name}>
            <EnvironmentLabel environment={environment} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function EnvironmentLabel({ environment }: { environment: Environment }): React.JSX.Element {
  return (
    <span className="flex items-center gap-2">
      <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
      {environment.name}
      <span className="font-mono text-xs text-muted-foreground">{environment.branch}</span>
    </span>
  )
}
