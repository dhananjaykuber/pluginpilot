import { useState } from 'react'
import type { RepositorySummary } from '@shared/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchInput } from '@/components/common/SearchInput'
import { ExternalLink } from '@/components/common/ExternalLink'
import { RepositoryResults } from './RepositoryResults'

const TOKEN_SETTINGS_URL = 'https://github.com/settings/tokens'

type RepositoryPickerProps = {
  selected: RepositorySummary | null
  onSelect: (repository: RepositorySummary) => void
}

export function RepositoryPicker({ selected, onSelect }: RepositoryPickerProps): React.JSX.Element {
  const [search, setSearch] = useState('')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose repository</CardTitle>
        <CardDescription>Repositories your GitHub account can push to.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search repositories…" />
        <RepositoryResults search={search} selected={selected} onSelect={onSelect} />
        <p className="text-sm text-muted-foreground">
          Missing a repository? Check that your token is{' '}
          <ExternalLink href={TOKEN_SETTINGS_URL}>
            authorized for its organization&apos;s SSO
          </ExternalLink>
          .
        </p>
      </CardContent>
    </Card>
  )
}
