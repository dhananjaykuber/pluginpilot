import { useParams } from 'react-router'
import { FolderXIcon } from 'lucide-react'
import type { Project } from '@shared/types'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { EnvironmentSelect } from '@/components/project/EnvironmentSelect'
import { PluginsPanel } from '@/components/project/PluginsPanel'
import { ScanButton } from '@/components/project/ScanButton'
import { ProjectSettingsButton } from '@/components/project/ProjectSettingsButton'
import { useProject } from '@/hooks/useProject'
import { useSelectedEnvironment } from '@/hooks/useSelectedEnvironment'
import { paths } from '@/lib/paths'

export function ProjectPage(): React.JSX.Element | null {
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

  return <ProjectPlugins project={project} />
}

function ProjectPlugins({ project }: { project: Project }): React.JSX.Element {
  const { environment, selectEnvironment } = useSelectedEnvironment(project)
  const fullName = `${project.repo.owner}/${project.repo.name}`

  return (
    <>
      <PageHeader
        title="Plugins"
        description="All installed plugins for this environment, known vulnerabilities, and available updates."
        breadcrumbs={[
          { label: 'Projects', to: paths.projects },
          { label: `${fullName} (${environment.name})` },
          { label: 'Plugins' }
        ]}
        actions={
          <>
            <EnvironmentSelect
              environments={project.environments}
              value={environment}
              onChange={selectEnvironment}
            />
            <ScanButton projectId={project.id} branch={environment.branch} />
            <ProjectSettingsButton projectId={project.id} />
          </>
        }
      />
      <PluginsPanel key={environment.branch} target={{ projectId: project.id, environment }} />
    </>
  )
}
