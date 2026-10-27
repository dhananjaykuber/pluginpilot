import { useParams } from 'react-router'
import { FolderXIcon, PuzzleIcon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { useProject } from '@/hooks/useProject'
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

  const fullName = `${project.repo.owner}/${project.repo.name}`

  return (
    <>
      <PageHeader
        title="Plugins"
        description="All installed plugins for this environment, known vulnerabilities, and available updates."
        breadcrumbs={[
          { label: 'Projects', to: paths.projects },
          { label: fullName },
          { label: 'Plugins' }
        ]}
      />
      <EmptyState
        icon={PuzzleIcon}
        title="No plugins scanned yet"
        description="The plugin list for the selected environment will appear here."
      />
    </>
  )
}
