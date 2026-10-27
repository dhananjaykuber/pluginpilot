import { useParams } from 'react-router'
import { FolderXIcon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { DeleteProjectCard } from '@/components/project-settings/DeleteProjectCard'
import { ProjectSettingsForm } from '@/components/project-settings/ProjectSettingsForm'
import { useProject } from '@/hooks/useProject'
import { paths } from '@/lib/paths'

export function ProjectSettingsPage(): React.JSX.Element | null {
  const { projectId = '' } = useParams()
  const { project, isPending } = useProject(projectId)

  if (isPending) {
    return null
  }

  if (!project) {
    return (
      <EmptyState
        icon={FolderXIcon}
        title="Project not found"
        description="This project may have been removed."
      />
    )
  }

  const fullName = `${project.repo.owner}/${project.repo.name}`

  return (
    <>
      <PageHeader
        title="Project settings"
        description="Change where plugins live and which branch each environment uses."
        breadcrumbs={[
          { label: 'Projects', to: paths.projects },
          { label: fullName, to: paths.project(project.id) },
          { label: 'Settings' }
        ]}
      />
      <div className="max-w-3xl space-y-6">
        <ProjectSettingsForm project={project} />
        <DeleteProjectCard project={project} />
      </div>
    </>
  )
}
