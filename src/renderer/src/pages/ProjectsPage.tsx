import { FolderGit2Icon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { AddProjectButton } from '@/components/projects/AddProjectButton'
import { ScanAllProjectsButton } from '@/components/projects/ScanAllProjectsButton'
import { ProjectsTable } from '@/components/projects/ProjectsTable'
import { useProjects } from '@/hooks/useProjects'

export function ProjectsPage(): React.JSX.Element {
  return (
    <>
      <PageHeader
        title="Projects"
        description="WordPress projects you manage. Open a project to review its plugins and raise update pull requests."
        actions={
          <>
            <ScanAllProjectsButton />
            <AddProjectButton />
          </>
        }
      />
      <ProjectsContent />
    </>
  )
}

function ProjectsContent(): React.JSX.Element | null {
  const { data: projects, isPending } = useProjects()

  if (isPending) {
    return null
  }

  if (!projects?.length) {
    return (
      <EmptyState
        icon={FolderGit2Icon}
        title="No projects yet"
        description="Add a GitHub repository to start tracking its plugins."
        action={<AddProjectButton />}
      />
    )
  }

  return <ProjectsTable projects={projects} />
}
