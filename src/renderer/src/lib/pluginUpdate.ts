import type {
  Environment,
  PluginUpdateDetails,
  PluginUpdateRequest,
  PluginUpdateStep,
  PluginVulnerability,
  UploadedPluginZip
} from '@shared/types'
import { compareVersions } from '@shared/versions'
import { shortenPluginName, type PluginListItem } from './plugins'

export type UpdateTarget = {
  projectId: string
  environment: Environment
}

// Omit applied to each member of a union, so each update variant keeps its own fields.
type DistributiveOmit<T, Key extends PropertyKey> = T extends unknown ? Omit<T, Key> : never

export type NewPluginUpdate = DistributiveOmit<PluginUpdateRequest, 'updateId'>

export const updateSteps: PluginUpdateStep[] = ['prepare', 'commit', 'pull-request']

export function getUpdateStepLabel(step: PluginUpdateStep, update: NewPluginUpdate): string {
  switch (step) {
    case 'prepare':
      return getPrepareLabel(update)
    case 'commit':
      return 'Committing the changes to a new branch'
    case 'pull-request':
      return 'Opening the pull request'
  }
}

function getPrepareLabel(update: NewPluginUpdate): string {
  if (update.source === 'composer') {
    return 'Updating composer.lock with Composer'
  }

  return update.zip.from === 'upload' ? 'Reading the zip file' : 'Downloading from WordPress.org'
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
    ...getUpdateDetails(plugin, target, version, availableVersion),
    changelogUrl: plugin.isOnWordPressOrg
      ? `https://wordpress.org/plugins/${plugin.slug}/#developers`
      : null,
    // Filled in by the update dialog once the changelog has loaded.
    changelog: [],
    requirements: plugin.requirements
  }

  if (plugin.source === 'composer' && packageName) {
    return { ...details, source: 'composer', packageName }
  }

  if (plugin.source === 'manual' && downloadUrl) {
    return { ...details, source: 'manual', zip: { from: 'wordpress-org', url: downloadUrl } }
  }

  return null
}

// Plugins that can be updated automatically and don't have an open pull request yet,
// by slug. These are the ones that can be selected for bulk pull requests.
export function getBulkUpdates(
  plugins: PluginListItem[],
  target: UpdateTarget
): Map<string, NewPluginUpdate> {
  return new Map(
    plugins.flatMap((plugin) => {
      const update = plugin.pullRequest ? null : toPluginUpdate(plugin, target)
      return update ? [[plugin.slug, update] as const] : []
    })
  )
}

// Committed plugins that aren't on WordPress.org, such as premium plugins, are updated from
// a zip the user downloads from the vendor.
export function canUpdateFromZip(plugin: PluginListItem): boolean {
  return plugin.source === 'manual' && plugin.isOnWordPressOrg === false && !!plugin.version
}

export function toZipUpdate(
  plugin: PluginListItem,
  target: UpdateTarget,
  zip: UploadedPluginZip
): NewPluginUpdate {
  return {
    ...getUpdateDetails(plugin, target, plugin.version ?? '', zip.version),
    changelogUrl: null,
    changelog: [],
    requirements: null,
    source: 'manual',
    zip: { from: 'upload', zipId: zip.zipId }
  }
}

function getUpdateDetails(
  plugin: PluginListItem,
  target: UpdateTarget,
  fromVersion: string,
  toVersion: string
): Omit<PluginUpdateDetails, 'updateId' | 'changelogUrl' | 'changelog' | 'requirements'> {
  return {
    projectId: target.projectId,
    environmentName: target.environment.name,
    slug: plugin.slug,
    // The short name keeps PR titles, descriptions and commit messages readable.
    name: shortenPluginName(plugin.displayName),
    path: plugin.path,
    fromVersion,
    toVersion,
    securityFixes: (plugin.vulnerabilities ?? [])
      .filter((vulnerability) => isFixedBy(vulnerability, toVersion))
      .map(({ title, cve }) => ({ title, cve }))
  }
}

// A vulnerability is fixed when one of its patched versions is at or below the target version.
function isFixedBy(vulnerability: PluginVulnerability, version: string): boolean {
  return vulnerability.patchedVersions.some((patched) => compareVersions(patched, version) <= 0)
}
