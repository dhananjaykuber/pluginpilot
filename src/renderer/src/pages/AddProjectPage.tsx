import { useState } from 'react'
import type { RepositorySummary } from '@shared/types'
import { PageHeader } from '@/components/common/PageHeader'
import { RepositoryPicker } from '@/components/add-project/RepositoryPicker'
import { DetectedSetupCard } from '@/components/add-project/DetectedSetupCard'
import { paths } from '@/lib/paths'

export function AddProjectPage(): React.JSX.Element {
  const [repository, setRepository] = useState<RepositorySummary | null>(null)

  return (
    <>
      <PageHeader
        title="Add Project"
        description="Connect a GitHub repository and map its environments to branches."
        breadcrumbs={[{ label: 'Projects', to: paths.projects }, { label: 'Add Project' }]}
      />
      <div className="max-w-3xl space-y-6">
        <RepositoryPicker selected={repository} onSelect={setRepository} />
        {repository && <DetectedSetupCard repository={repository} />}
      </div>
    </>
  )
}
