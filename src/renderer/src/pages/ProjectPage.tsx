import { useParams } from 'react-router'
import { PuzzleIcon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { paths } from '@/lib/paths'

export function ProjectPage(): React.JSX.Element {
  const { projectId = '' } = useParams()

  return (
    <>
      <PageHeader
        title="Plugins"
        description="All installed plugins for this environment, known vulnerabilities, and available updates."
        breadcrumbs={[
          { label: 'Projects', to: paths.projects },
          { label: projectId },
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
