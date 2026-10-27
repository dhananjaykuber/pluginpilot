import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type PullRequestLabelsCardProps = {
  labels: string
  onChange: (labels: string) => void
}

export function PullRequestLabelsCard({
  labels,
  onChange
}: PullRequestLabelsCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pull request labels</CardTitle>
        <CardDescription>
          Added to every update pull request, separated by commas. Labels that don&apos;t exist yet
          are created. Zip updates also get skip-phpcs-scan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          value={labels}
          onChange={(event) => onChange(event.target.value)}
          placeholder="dependencies, plugins"
          aria-label="Pull request labels"
        />
      </CardContent>
    </Card>
  )
}
