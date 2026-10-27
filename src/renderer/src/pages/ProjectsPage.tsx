import { FolderGit2Icon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { AddProjectButton } from '@/components/projects/AddProjectButton'

export function ProjectsPage(): React.JSX.Element {
  return (
    <>
      <PageHeader
        title="Projects"
        description="WordPress projects you manage. Open a project to review its plugins and raise update pull requests."
        actions={<AddProjectButton />}
      />
      <EmptyState
        icon={FolderGit2Icon}
        title="No projects yet"
        description="Add a GitHub repository to start tracking its plugins."
        action={<AddProjectButton />}
      />
    </>
  )
}
