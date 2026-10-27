import { compareVersions } from '../../shared/versions'

// rtCamp's Composer repository mirrors premium plugins (ACF Pro, Gravity Forms, …) as
// "rt-plugin/<slug>". Version metadata is public; downloading needs Composer credentials.
const RTCAMP_REPOSITORY = 'https://packages.rtcamp.workers.dev'
export const RTCAMP_PLUGIN_VENDOR = 'rt-plugin'

type PackageMetadata = {
  packages?: Record<string, Record<string, { version?: string }> | { version?: string }[]>
}

// Latest released version of a package, or null when the repository doesn't have it.
export async function fetchRtcampLatestVersion(packageName: string): Promise<string | null> {
  const response = await fetch(`${RTCAMP_REPOSITORY}/p2/${packageName}.json`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`rtCamp packages responded with status ${response.status}.`)
  }

  const metadata = (await response.json()) as PackageMetadata
  return findNewestRelease(readVersions(metadata, packageName))
}

// The repository lists versions as an object keyed by version; standard Composer v2
// metadata uses a list. Both are accepted.
function readVersions(metadata: PackageMetadata, packageName: string): string[] {
  const entries = metadata.packages?.[packageName] ?? []
  const releases = Array.isArray(entries) ? entries : Object.values(entries)

  return releases.flatMap((release) => (release.version ? [release.version] : []))
}

function findNewestRelease(versions: string[]): string | null {
  return versions
    .filter((version) => !version.startsWith('dev-') && !version.endsWith('-dev'))
    .map((version) => version.replace(/^v(?=\d)/, ''))
    .reduce<string | null>(
      (newest, version) =>
        newest === null || compareVersions(version, newest) > 0 ? version : newest,
      null
    )
}
