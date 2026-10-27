import { ArrowRightIcon, ShieldAlertIcon } from 'lucide-react'
import { getUpdateBranchName } from '@shared/pluginUpdate'
import { pluralize } from '@/lib/format'
import type { NewPluginUpdate } from '@/lib/pluginUpdate'

type UpdateSummaryProps = {
  update: NewPluginUpdate
  baseBranch: string
}

export function UpdateSummary({ update, baseBranch }: UpdateSummaryProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2 font-mono text-lg">
        {update.fromVersion}
        <ArrowRightIcon className="size-4 text-muted-foreground" />
        <span className="font-semibold">{update.toVersion}</span>
      </p>

      {update.securityFixes.length > 0 && (
        <p className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400">
          <ShieldAlertIcon className="size-4" />
          Fixes{' '}
          {pluralize(update.securityFixes.length, 'known vulnerability', 'known vulnerabilities')}
        </p>
      )}

      <dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
        <dt className="text-muted-foreground">Environment</dt>
        <dd>
          {update.environmentName} → <code>{baseBranch}</code>
        </dd>
        <dt className="text-muted-foreground">New branch</dt>
        <dd>
          <code>{getUpdateBranchName(update.slug, update.toVersion)}</code>
        </dd>
        {update.source === 'composer' ? (
          <>
            <dt className="text-muted-foreground">Package</dt>
            <dd>
              <code>{update.packageName}</code>
              <span className="text-muted-foreground"> · composer.json and composer.lock</span>
            </dd>
          </>
        ) : (
          <>
            <dt className="text-muted-foreground">Folder</dt>
            <dd>
              <code>{update.path}</code>
            </dd>
          </>
        )}
      </dl>
    </div>
  )
}
