import { GitBranchPlusIcon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { paths } from '@/lib/paths'

export function AddProjectPage(): React.JSX.Element {
  return (
    <>
      <PageHeader
        title="Add Project"
        description="Connect a GitHub repository and map its environments to branches."
        breadcrumbs={[{ label: 'Projects', to: paths.projects }, { label: 'Add Project' }]}
      />
      <EmptyState
        icon={GitBranchPlusIcon}
        title="Repository setup"
        description="Picking a repository and configuring environments will appear here."
      />
    </>
  )
}
