import type {
  InstalledPlugin,
  PluginRelease,
  PluginReleases,
  PluginRequirements,
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
  // Minimum WordPress and PHP versions of the available release.
  requirements: PluginRequirements | null
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
        requirements: release?.requirements ?? null,
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

export type PluginFilter = 'all' | 'updates' | 'vulnerable' | 'not-on-wordpress-org' | 'open-pr'

export const pluginFilters: {
  value: PluginFilter
  label: string
  matches: (plugin: PluginListItem) => boolean
}[] = [
  { value: 'all', label: 'All', matches: () => true },
  { value: 'updates', label: 'Updates available', matches: (plugin) => !!plugin.availableVersion },
  {
    value: 'vulnerable',
    label: 'Vulnerable',
    matches: (plugin) => !!plugin.vulnerabilities?.length
  },
  {
    value: 'not-on-wordpress-org',
    label: 'Not on WordPress.org',
    matches: (plugin) => plugin.isOnWordPressOrg === false
  },
  { value: 'open-pr', label: 'Open pull request', matches: (plugin) => !!plugin.pullRequest }
]

export function filterPlugins(
  plugins: PluginListItem[],
  search: string,
  filter: PluginFilter
): PluginListItem[] {
  const query = search.trim().toLowerCase()
  const { matches } = getPluginFilter(filter)

  return plugins.filter(
    (plugin) =>
      matches(plugin) &&
      (plugin.displayName.toLowerCase().includes(query) ||
        plugin.slug.toLowerCase().includes(query))
  )
}

export function getPluginFilter(filter: PluginFilter): (typeof pluginFilters)[number] {
  return pluginFilters.find((option) => option.value === filter) ?? pluginFilters[0]
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
