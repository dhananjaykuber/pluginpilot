import type { ChangelogEntry, PluginRelease, PluginReleases } from '../../shared/types'
import { parseChangelog, selectChangelogEntries } from './changelog'
import { mapWithConcurrency } from './concurrency'
import { decodeHtmlEntities } from './htmlEntities'

const PLUGIN_INFO_URL = 'https://api.wordpress.org/plugins/info/1.2/'
const REQUEST_CONCURRENCY = 8

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
  sections?: { changelog?: string }
}

export async function getPluginReleases(slugs: string[]): Promise<PluginReleases> {
  const uniqueSlugs = [...new Set(slugs)]
  const releases = await mapWithConcurrency(uniqueSlugs, REQUEST_CONCURRENCY, fetchPluginRelease)

  return Object.fromEntries(uniqueSlugs.map((slug, index) => [slug, releases[index]]))
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
async function fetchPluginRelease(slug: string): Promise<PluginRelease | null> {
  const info = await fetchPluginInfo(slug, { includeSections: false })

  if (!info) {
    return null
  }

  return {
    slug,
    name: decodeHtmlEntities(info.name),
    latestVersion: info.version,
    downloadUrl: info.download_link
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
