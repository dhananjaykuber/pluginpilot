import { useParams } from 'react-router'
import { FolderXIcon } from 'lucide-react'
import type { Project } from '@shared/types'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EnvironmentSelect } from '@/components/project/EnvironmentSelect'
import { PluginsPanel } from '@/components/project/PluginsPanel'
import { EnvironmentComparison } from '@/components/project/EnvironmentComparison'
import { ScanAllButton } from '@/components/project/ScanAllButton'
import { ScanButton } from '@/components/project/ScanButton'
import { ProjectSettingsButton } from '@/components/project/ProjectSettingsButton'
import { ViewOnGitHubButton } from '@/components/project/ViewOnGitHubButton'
import { useProject } from '@/hooks/useProject'
import { useSelectedEnvironment } from '@/hooks/useSelectedEnvironment'
import { useProjectView, type ProjectView } from '@/hooks/useProjectView'
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
  const [view, setView] = useProjectView()
  const fullName = `${project.repo.owner}/${project.repo.name}`
  const isCompareView = view === 'compare'

  return (
    <>
      <PageHeader
        title="Plugins"
        description={
          isCompareView
            ? 'Plugin versions side by side across environments.'
            : 'All installed plugins for this environment, known vulnerabilities, and available updates.'
        }
        breadcrumbs={[
          { label: 'Projects', to: paths.projects },
          { label: isCompareView ? fullName : `${fullName} (${environment.name})` },
          { label: 'Plugins' }
        ]}
        actions={
          <>
            {isCompareView ? (
              <ScanAllButton projectId={project.id} />
            ) : (
              <>
                <EnvironmentSelect
                  environments={project.environments}
                  value={environment}
                  onChange={selectEnvironment}
                />
                <ScanButton projectId={project.id} branch={environment.branch} />
              </>
            )}
            <ViewOnGitHubButton
              repo={project.repo}
              branch={isCompareView ? null : environment.branch}
            />
            <ProjectSettingsButton projectId={project.id} />
          </>
        }
      />
      <Tabs value={view} onValueChange={(next) => setView(next as ProjectView)}>
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="plugins">Plugin management</TabsTrigger>
          <TabsTrigger value="compare">Compare environments</TabsTrigger>
        </TabsList>
        <TabsContent value="plugins">
          <PluginsPanel key={environment.branch} target={{ projectId: project.id, environment }} />
        </TabsContent>
        <TabsContent value="compare">
          <EnvironmentComparison project={project} />
        </TabsContent>
      </Tabs>
    </>
  )
}
