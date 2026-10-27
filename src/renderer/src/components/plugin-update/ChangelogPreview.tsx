import { Loader2Icon } from 'lucide-react'
import type { ChangelogEntry } from '@shared/types'
import { ExternalLink } from '@/components/common/ExternalLink'

type ChangelogPreviewProps = {
  entries: ChangelogEntry[] | undefined
  isLoading: boolean
  changelogUrl: string
}

export function ChangelogPreview({
  entries,
  isLoading,
  changelogUrl
}: ChangelogPreviewProps): React.JSX.Element {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <h3 className="font-medium">What&apos;s new</h3>
        <ExternalLink href={changelogUrl}>Full changelog</ExternalLink>
      </div>
      <ChangelogContent entries={entries} isLoading={isLoading} />
    </section>
  )
}

function ChangelogContent({
  entries,
  isLoading
}: Omit<ChangelogPreviewProps, 'changelogUrl'>): React.JSX.Element {
  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Loading changelog…
      </p>
    )
  }

  // The changelog failed to load or has no entries for these versions.
  if (!entries?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No release notes found for these versions. Check the full changelog.
      </p>
    )
  }

  return (
    <div className="max-h-56 space-y-3 overflow-y-auto rounded-lg border bg-muted/40 p-3 text-sm">
      {entries.map((entry) => (
        <div key={entry.version}>
          <p className="font-mono font-semibold">{entry.version}</p>
          <ul className="list-disc space-y-0.5 pl-5 text-muted-foreground">
            {entry.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
