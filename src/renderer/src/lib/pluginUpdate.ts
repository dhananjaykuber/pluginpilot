import type {
  Environment,
  PluginSource,
  PluginUpdateRequest,
  PluginUpdateStep,
  PluginVulnerability
} from '@shared/types'
import { compareVersions } from '@shared/versions'
import type { PluginListItem } from './plugins'

export type UpdateTarget = {
  projectId: string
  environment: Environment
}

// Omit applied to each member of a union, so each update variant keeps its own fields.
type DistributiveOmit<T, Key extends PropertyKey> = T extends unknown ? Omit<T, Key> : never

export type NewPluginUpdate = DistributiveOmit<PluginUpdateRequest, 'updateId'>

export const updateSteps: PluginUpdateStep[] = ['prepare', 'commit', 'pull-request']

const prepareLabels: Record<PluginSource, string> = {
  manual: 'Downloading from WordPress.org',
  composer: 'Updating composer.lock with Composer'
}

export function getUpdateStepLabel(step: PluginUpdateStep, source: PluginSource): string {
  switch (step) {
    case 'prepare':
      return prepareLabels[source]
    case 'commit':
      return 'Committing the changes to a new branch'
    case 'pull-request':
      return 'Opening the pull request'
  }
}

// Plugins with a newer WordPress.org release can be updated: committed plugins by replacing
// their folder, Composer plugins through composer.lock.
export function toPluginUpdate(
  plugin: PluginListItem,
  target: UpdateTarget
): NewPluginUpdate | null {
  const { version, availableVersion, downloadUrl, packageName } = plugin

  if (!version || !availableVersion) {
    return null
  }

  const details = {
    projectId: target.projectId,
    environmentName: target.environment.name,
    slug: plugin.slug,
    name: plugin.displayName,
    path: plugin.path,
    fromVersion: version,
    toVersion: availableVersion,
    changelogUrl: plugin.isOnWordPressOrg
      ? `https://wordpress.org/plugins/${plugin.slug}/#developers`
      : null,
    securityFixes: (plugin.vulnerabilities ?? [])
      .filter((vulnerability) => isFixedBy(vulnerability, availableVersion))
      .map(({ title, cve }) => ({ title, cve }))
  }

  if (plugin.source === 'composer' && packageName) {
    return { ...details, source: 'composer', packageName }
  }

  if (plugin.source === 'manual' && downloadUrl) {
    return { ...details, source: 'manual', downloadUrl }
  }

  return null
}

// A vulnerability is fixed when one of its patched versions is at or below the target version.
function isFixedBy(vulnerability: PluginVulnerability, version: string): boolean {
  return vulnerability.patchedVersions.some((patched) => compareVersions(patched, version) <= 0)
}
