import { SettingsIcon } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'

export function SettingsPage(): React.JSX.Element {
  return (
    <>
      <PageHeader title="Settings" description="Manage your GitHub account and app preferences." />
      <EmptyState
        icon={SettingsIcon}
        title="Nothing to configure yet"
        description="GitHub, vulnerability source and pull request settings will appear here."
      />
    </>
  )
}
