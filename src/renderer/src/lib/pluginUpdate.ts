import type {
  Environment,
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

export type NewPluginUpdate = Omit<PluginUpdateRequest, 'updateId'>

export const updateStepLabels: Record<PluginUpdateStep, string> = {
  download: 'Downloading from WordPress.org',
  commit: 'Committing the new version to a branch',
  'pull-request': 'Opening the pull request'
}

export const updateSteps = Object.keys(updateStepLabels) as PluginUpdateStep[]

// Committed plugins with a newer WordPress.org release can be updated. Composer plugins come later.
export function toPluginUpdate(
  plugin: PluginListItem,
  target: UpdateTarget
): NewPluginUpdate | null {
  const { version, availableVersion, downloadUrl } = plugin

  if (plugin.source !== 'manual' || !version || !availableVersion || !downloadUrl) {
    return null
  }

  return {
    projectId: target.projectId,
    environmentName: target.environment.name,
    slug: plugin.slug,
    name: plugin.displayName,
    path: plugin.path,
    fromVersion: version,
    toVersion: availableVersion,
    downloadUrl,
    securityFixes: (plugin.vulnerabilities ?? [])
      .filter((vulnerability) => isFixedBy(vulnerability, availableVersion))
      .map(({ title, cve }) => ({ title, cve }))
  }
}

// A vulnerability is fixed when one of its patched versions is at or below the target version.
function isFixedBy(vulnerability: PluginVulnerability, version: string): boolean {
  return vulnerability.patchedVersions.some((patched) => compareVersions(patched, version) <= 0)
}
