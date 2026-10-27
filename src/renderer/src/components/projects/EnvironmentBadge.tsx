import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { getEnvironmentColor } from '@/lib/environments'
import { paths } from '@/lib/paths'

type EnvironmentBadgeProps = {
  projectId: string
  name: string
  branch: string
}

// Opens the project with this environment already selected.
export function EnvironmentBadge({
  projectId,
  name,
  branch
}: EnvironmentBadgeProps): React.JSX.Element {
  return (
    <Badge
      className={getEnvironmentColor(name).badge}
      render={<Link to={paths.projectEnvironment(projectId, name)} title={`${name} → ${branch}`} />}
    >
      {name}
    </Badge>
  )
}
