import { Link } from 'react-router'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { paths } from '@/lib/paths'

export function AddProjectButton(): React.JSX.Element {
  return (
    <Button render={<Link to={paths.newProject} />} nativeButton={false}>
      <PlusIcon data-icon="inline-start" />
      Add Project
    </Button>
  )
}
