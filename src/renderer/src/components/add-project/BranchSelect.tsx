import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type BranchSelectProps = {
  value: string
  branches: string[]
  onChange: (branch: string) => void
}

export function BranchSelect({ value, branches, onChange }: BranchSelectProps): React.JSX.Element {
  return (
    <Select value={value || null} onValueChange={(branch) => branch && onChange(branch)}>
      <SelectTrigger className="w-full font-mono" aria-label="Branch">
        <SelectValue placeholder="Select branch" />
      </SelectTrigger>
      <SelectContent>
        {branches.map((branch) => (
          <SelectItem key={branch} value={branch} className="font-mono">
            {branch}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
