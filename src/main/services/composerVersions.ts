import { compareVersions } from '../../shared/versions'

// Released versions from `composer show <package> --all --format=json`, without dev branches
// such as "dev-main" or "3.x-dev", and without a leading "v".
export function getReleasedVersions(showOutput: string): string[] {
  const { versions = [] } = JSON.parse(showOutput) as { versions?: string[] }

  return versions
    .filter((version) => !version.startsWith('dev-') && !version.endsWith('-dev'))
    .map((version) => version.replace(/^v(?=\d)/, ''))
}

export function findNewestVersion(versions: string[]): string | null {
  return versions.reduce<string | null>(
    (newest, version) =>
      newest === null || compareVersions(version, newest) > 0 ? version : newest,
    null
  )
}
