import type { PluginRelease, PluginReleases } from '../../shared/types'
import { mapWithConcurrency } from './concurrency'
import { decodeHtmlEntities } from './htmlEntities'

const PLUGIN_INFO_URL = 'https://api.wordpress.org/plugins/info/1.2/'
const REQUEST_CONCURRENCY = 8

// Fields the plugin info API includes by default that PluginPilot doesn't use.
const UNUSED_FIELDS = [
  'sections',
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
}

export async function getPluginReleases(slugs: string[]): Promise<PluginReleases> {
  const uniqueSlugs = [...new Set(slugs)]
  const releases = await mapWithConcurrency(uniqueSlugs, REQUEST_CONCURRENCY, fetchPluginRelease)

  return Object.fromEntries(uniqueSlugs.map((slug, index) => [slug, releases[index]]))
}

// Returns null for plugins that aren't on WordPress.org, such as premium or custom plugins.
async function fetchPluginRelease(slug: string): Promise<PluginRelease | null> {
  const url = new URL(PLUGIN_INFO_URL)
  url.searchParams.set('action', 'plugin_information')
  url.searchParams.set('request[slug]', slug)
  UNUSED_FIELDS.forEach((field) => url.searchParams.set(`request[fields][${field}]`, '0'))

  const response = await fetch(url)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`WordPress.org responded with status ${response.status}.`)
  }

  const data = (await response.json()) as PluginInfoResponse

  return {
    slug,
    name: decodeHtmlEntities(data.name),
    latestVersion: data.version,
    downloadUrl: data.download_link
  }
}
