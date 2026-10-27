import { PageHeader } from '@/components/common/PageHeader'
import { WordfenceKeyCard } from '@/components/settings/WordfenceKeyCard'

export function SettingsPage(): React.JSX.Element {
  return (
    <>
      <PageHeader title="Settings" description="Manage integrations and app preferences." />
      <div className="max-w-3xl space-y-6">
        <WordfenceKeyCard />
      </div>
    </>
  )
}
