import type { ChangelogEntry, PluginRelease } from '../../shared/types'
import { parseChangelog, selectChangelogEntries } from './changelog'
import { decodeHtmlEntities } from './htmlEntities'

const PLUGIN_INFO_URL = 'https://api.wordpress.org/plugins/info/1.2/'
// Fields the plugin info API includes by default that PluginPilot doesn't use.
// "sections" (description, changelog, …) is only requested for changelogs.
const UNUSED_FIELDS = [
  'description',
  'reviews',
  'banners',
  'icons',
  'screenshots',
  'versions',
  'contributors',
  'ratings',
  'tags'
]

type PluginInfoResponse = {
  name: string
  version: string
  download_link: string
  // WordPress.org sends false when a plugin doesn't state a minimum.
  requires?: string | false
  requires_php?: string | false
  sections?: { changelog?: string }
}

// Changelog entries for versions after `fromVersion`, up to and including `toVersion`.
export async function getPluginChangelog(
  slug: string,
  fromVersion: string,
  toVersion: string
): Promise<ChangelogEntry[]> {
  const info = await fetchPluginInfo(slug, { includeSections: true })
  const entries = parseChangelog(info?.sections?.changelog ?? '')

  return selectChangelogEntries(entries, fromVersion, toVersion)
}

// Returns null for plugins that aren't on WordPress.org, such as premium or custom plugins.
export async function fetchWordPressOrgRelease(slug: string): Promise<PluginRelease | null> {
  const info = await fetchPluginInfo(slug, { includeSections: false })

  if (!info) {
    return null
  }

  return {
    slug,
    source: 'wordpress-org',
    name: decodeHtmlEntities(info.name),
    latestVersion: info.version,
    downloadUrl: info.download_link,
    requirements: {
      wordPress: info.requires || null,
      php: info.requires_php || null
    }
  }
}

async function fetchPluginInfo(
  slug: string,
  { includeSections }: { includeSections: boolean }
): Promise<PluginInfoResponse | null> {
  const url = new URL(PLUGIN_INFO_URL)
  url.searchParams.set('action', 'plugin_information')
  url.searchParams.set('request[slug]', slug)
  url.searchParams.set('request[fields][sections]', includeSections ? '1' : '0')
  UNUSED_FIELDS.forEach((field) => url.searchParams.set(`request[fields][${field}]`, '0'))

  const response = await fetch(url)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`WordPress.org responded with status ${response.status}.`)
  }

  return (await response.json()) as PluginInfoResponse
}
