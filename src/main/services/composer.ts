const WPACKAGIST_PLUGIN_PREFIX = 'wpackagist-plugin/'

type ComposerJson = {
  require?: Record<string, string>
  'require-dev'?: Record<string, string>
  extra?: {
    'installer-paths'?: Record<string, string[]>
  }
}

export function parseComposerJson(contents: string): ComposerJson | null {
  try {
    return JSON.parse(contents) as ComposerJson
  } catch {
    return null
  }
}

export function isDevRequirement(composer: ComposerJson, packageName: string): boolean {
  return packageName in (composer['require-dev'] ?? {})
}

// Keeps exact pins exact; anything else becomes a caret range starting at the new version.
export function getConstraintForVersion(
  composer: ComposerJson,
  packageName: string,
  version: string
): string {
  const current = composer.require?.[packageName] ?? composer['require-dev']?.[packageName] ?? ''
  const isExactPin = /^v?\d[\w.-]*$/.test(current.trim())

  return isExactPin ? version : `^${version}`
}

export function getRequiredPackages(composer: ComposerJson): Set<string> {
  return new Set([
    ...Object.keys(composer.require ?? {}),
    ...Object.keys(composer['require-dev'] ?? {})
  ])
}

export function countWpackagistPlugins(composer: ComposerJson): number {
  return [...getRequiredPackages(composer)].filter((name) =>
    name.startsWith(WPACKAGIST_PLUGIN_PREFIX)
  ).length
}

// Reads where Composer installs WordPress plugins, e.g. "wp-content/plugins/{$name}/" → "wp-content/plugins".
export function getPluginInstallerPath(composer: ComposerJson): string | null {
  const installerPaths = composer.extra?.['installer-paths'] ?? {}
  const pluginEntry = Object.entries(installerPaths).find(
    ([, types]) => Array.isArray(types) && types.includes('type:wordpress-plugin')
  )

  return pluginEntry ? pluginEntry[0].replace(/\/?\{\$name\}\/?$/, '') : null
}

type ComposerLockPackage = {
  name: string
  version: string
  type?: string
}

type ComposerLock = {
  packages?: ComposerLockPackage[]
  'packages-dev'?: ComposerLockPackage[]
}

export type LockedPlugin = {
  packageName: string
  slug: string
  version: string
}

// WordPress plugins pinned in composer.lock, from wpackagist or any other repository.
export function getLockedPlugins(lockContents: string): LockedPlugin[] {
  return getLockedPackages(lockContents)
    .filter((pkg) => pkg.type === 'wordpress-plugin')
    .map((pkg) => ({
      packageName: pkg.name,
      slug: pkg.name.split('/').pop() ?? pkg.name,
      version: normalizeLockedVersion(pkg.version)
    }))
}

export function getLockedVersion(lockContents: string, packageName: string): string | null {
  const pkg = getLockedPackages(lockContents).find((candidate) => candidate.name === packageName)
  return pkg ? normalizeLockedVersion(pkg.version) : null
}

function getLockedPackages(lockContents: string): ComposerLockPackage[] {
  let lock: ComposerLock

  try {
    lock = JSON.parse(lockContents) as ComposerLock
  } catch {
    throw new Error('composer.lock is not valid JSON.')
  }

  return [...(lock.packages ?? []), ...(lock['packages-dev'] ?? [])]
}

// "v2.3.0" → "2.3.0"
function normalizeLockedVersion(version: string): string {
  return version.replace(/^v(?=\d)/, '')
}
