import type {
  InstalledPlugin,
  PluginRelease,
  PluginReleases,
  PluginSource,
  PluginVulnerability,
  UpdatePullRequest,
  VulnerabilityReport
} from '@shared/types'
import { findUpdatePullRequest } from '@shared/pluginUpdate'
import { isNewerVersion } from '@shared/versions'

export const pluginSourceLabels: Record<PluginSource, string> = {
  composer: 'Composer',
  manual: 'Manual'
}

export type PluginListItem = InstalledPlugin & {
  displayName: string
  availableVersion: string | null
  downloadUrl: string | null
  // null while WordPress.org hasn't been checked yet.
  isOnWordPressOrg: boolean | null
  // null until vulnerabilities have been checked, or when no Wordfence key is set.
  vulnerabilities: PluginVulnerability[] | null
  // An open pull request that already updates this plugin.
  pullRequest: UpdatePullRequest | null
}

export function toPluginListItems(
  plugins: InstalledPlugin[],
  releases: PluginReleases | undefined,
  vulnerabilities: VulnerabilityReport | null | undefined,
  pullRequests: UpdatePullRequest[] | undefined
): PluginListItem[] {
  return plugins
    .map((plugin) => {
      const release = releases?.[plugin.slug] ?? null

      return {
        ...plugin,
        displayName: getDisplayName(plugin, release),
        availableVersion: getAvailableVersion(plugin, release),
        downloadUrl: release?.downloadUrl ?? null,
        isOnWordPressOrg: releases ? release !== null : null,
        vulnerabilities: vulnerabilities ? (vulnerabilities.bySlug[plugin.slug] ?? []) : null,
        pullRequest: findUpdatePullRequest(pullRequests ?? [], plugin.slug)
      }
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}

// Many plugin names append a tagline, e.g. "CookieYes – Cookie Banner for Cookie Consent" or
// "Asset CleanUp: Page Speed Booster". Keeps the part before the first dash or colon.
export function shortenPluginName(name: string): string {
  const [shortName] = name.split(/\s+[–—-]\s+|:\s+/)
  return shortName.trim() || name
}

export function filterPlugins(plugins: PluginListItem[], search: string): PluginListItem[] {
  const query = search.trim().toLowerCase()

  if (!query) {
    return plugins
  }

  return plugins.filter(
    (plugin) =>
      plugin.displayName.toLowerCase().includes(query) || plugin.slug.toLowerCase().includes(query)
  )
}

// Composer plugins only know their slug, so use the WordPress.org name when there is one.
function getDisplayName(plugin: InstalledPlugin, release: PluginRelease | null): string {
  return plugin.source === 'composer' && release ? release.name : plugin.name
}

function getAvailableVersion(
  plugin: InstalledPlugin,
  release: PluginRelease | null
): string | null {
  if (!release || !plugin.version || !isNewerVersion(release.latestVersion, plugin.version)) {
    return null
  }

  return release.latestVersion
}
