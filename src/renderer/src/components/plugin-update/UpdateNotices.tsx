import { ShieldAlertIcon, TriangleAlertIcon, WrenchIcon } from 'lucide-react'
import { isMajorUpdate } from '@shared/versions'
import { pluralize } from '@/lib/format'
import type { NewPluginUpdate } from '@/lib/pluginUpdate'

type UpdateNoticesProps = {
  update: NewPluginUpdate
}

// Things to know before updating: security fixes, a major version jump and minimum versions.
export function UpdateNotices({ update }: UpdateNoticesProps): React.JSX.Element | null {
  const { wordPress, php } = update.requirements ?? {}
  const requirements = [wordPress && `WordPress ${wordPress}`, php && `PHP ${php}`].filter(Boolean)
  const isMajor = isMajorUpdate(update.fromVersion, update.toVersion)

  if (update.securityFixes.length === 0 && !isMajor && requirements.length === 0) {
    return null
  }

  return (
    <ul className="space-y-1 text-sm">
      {update.securityFixes.length > 0 && (
        <li className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
          <ShieldAlertIcon className="size-4" />
          Fixes{' '}
          {pluralize(update.securityFixes.length, 'known vulnerability', 'known vulnerabilities')}
        </li>
      )}
      {isMajor && (
        <li className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <TriangleAlertIcon className="size-4" />
          Major update. Check the changelog for breaking changes.
        </li>
      )}
      {requirements.length > 0 && (
        <li className="flex items-center gap-2 text-muted-foreground">
          <WrenchIcon className="size-4" />
          Requires {requirements.join(' and ')}
        </li>
      )}
    </ul>
  )
}
