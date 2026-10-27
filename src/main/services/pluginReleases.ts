import type { PluginRelease, PluginReleaseQuery, PluginReleases } from '../../shared/types'
import { mapWithConcurrency } from './concurrency'
import { fetchRtcampLatestVersion, RTCAMP_PLUGIN_VENDOR } from './rtcampPackages'
import { fetchWordPressOrgRelease } from './wordpressOrg'

const REQUEST_CONCURRENCY = 8

export async function getPluginReleases(queries: PluginReleaseQuery[]): Promise<PluginReleases> {
  const uniqueQueries = [...new Map(queries.map((query) => [query.slug, query])).values()]
  const releases = await mapWithConcurrency(uniqueQueries, REQUEST_CONCURRENCY, findLatestRelease)

  return Object.fromEntries(uniqueQueries.map((query, index) => [query.slug, releases[index]]))
}

// rtCamp packages come first for Composer "rt-plugin/…" packages, so the version offered is
// one Composer can install. Everything else uses WordPress.org, then rtCamp packages for
// plugins that aren't there, such as premium plugins.
async function findLatestRelease(query: PluginReleaseQuery): Promise<PluginRelease | null> {
  const rtcampPackage = query.packageName?.startsWith(`${RTCAMP_PLUGIN_VENDOR}/`)
    ? query.packageName
    : null

  if (rtcampPackage) {
    return (
      (await findRtcampRelease(query.slug, rtcampPackage)) ??
      (await fetchWordPressOrgRelease(query.slug))
    )
  }

  return (
    (await fetchWordPressOrgRelease(query.slug)) ??
    (await findRtcampRelease(query.slug, `${RTCAMP_PLUGIN_VENDOR}/${query.slug}`))
  )
}

async function findRtcampRelease(slug: string, packageName: string): Promise<PluginRelease | null> {
  const latestVersion = await fetchRtcampLatestVersion(packageName)

  if (!latestVersion) {
    return null
  }

  return {
    slug,
    source: 'rtcamp',
    name: null,
    latestVersion,
    downloadUrl: null,
    requirements: null
  }
}
