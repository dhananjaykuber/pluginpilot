import type { ComposerSetup, PluginFolder, RepositorySetup } from '@shared/types'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { pluralize } from '@/lib/format'
import { SetupRow } from './SetupRow'

const VISIBLE_BRANCH_COUNT = 5

type SetupSummaryProps = {
  setup: RepositorySetup
}

export function SetupSummary({ setup }: SetupSummaryProps): React.JSX.Element {
  return (
    <dl className="divide-y">
      <PluginFoldersRow folders={setup.pluginFolders} />
      <ComposerRow composer={setup.composer} />
      <BranchesRow branches={setup.branches} />
    </dl>
  )
}

export function SetupSummarySkeleton(): React.JSX.Element {
  return (
    <div className="divide-y">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="grid grid-cols-[8rem_1fr] gap-4 py-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-56" />
        </div>
      ))}
    </div>
  )
}

function PluginFoldersRow({ folders }: { folders: PluginFolder[] }): React.JSX.Element {
  if (folders.length === 0) {
    return (
      <SetupRow label="Plugin folder" status="warning">
        <p>No plugin folder found.</p>
        <p className="text-muted-foreground">You can set the path in the next step.</p>
      </SetupRow>
    )
  }

  return (
    <SetupRow label="Plugin folder" status="found">
      {folders.map((folder) => (
        <p key={folder.path}>
          <code>{folder.path}/</code>{' '}
          <span className="text-muted-foreground">· {pluralize(folder.pluginCount, 'plugin')}</span>
        </p>
      ))}
    </SetupRow>
  )
}

function ComposerRow({ composer }: { composer: ComposerSetup | null }): React.JSX.Element {
  if (!composer) {
    return (
      <SetupRow label="Composer" status="missing">
        <p>Not used</p>
      </SetupRow>
    )
  }

  if (!composer.isValid) {
    return (
      <SetupRow label="Composer" status="warning">
        <p>composer.json could not be read.</p>
      </SetupRow>
    )
  }

  return (
    <SetupRow label="Composer" status={composer.hasLock ? 'found' : 'warning'}>
      <p>
        {composer.hasLock ? 'composer.json + composer.lock' : 'composer.json without composer.lock'}{' '}
        <span className="text-muted-foreground">
          · {pluralize(composer.pluginPackageCount, 'WordPress.org plugin')}
        </span>
      </p>
      {composer.installerPath && (
        <p className="text-muted-foreground">
          Installs plugins to <code>{composer.installerPath}/</code>
        </p>
      )}
    </SetupRow>
  )
}

function BranchesRow({ branches }: { branches: string[] }): React.JSX.Element {
  const hiddenCount = branches.length - VISIBLE_BRANCH_COUNT

  return (
    <SetupRow label="Branches" status="found">
      <p>{pluralize(branches.length, 'branch', 'branches')}</p>
      <div className="flex flex-wrap gap-1">
        {branches.slice(0, VISIBLE_BRANCH_COUNT).map((branch) => (
          <Badge key={branch} variant="secondary">
            {branch}
          </Badge>
        ))}
        {hiddenCount > 0 && <Badge variant="outline">+{hiddenCount} more</Badge>}
      </div>
    </SetupRow>
  )
}
