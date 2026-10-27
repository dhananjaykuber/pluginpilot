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

export function countWpackagistPlugins(composer: ComposerJson): number {
  const packages = [
    ...Object.keys(composer.require ?? {}),
    ...Object.keys(composer['require-dev'] ?? {})
  ]

  return packages.filter((name) => name.startsWith(WPACKAGIST_PLUGIN_PREFIX)).length
}

// Reads where Composer installs WordPress plugins, e.g. "wp-content/plugins/{$name}/" → "wp-content/plugins".
export function getPluginInstallerPath(composer: ComposerJson): string | null {
  const installerPaths = composer.extra?.['installer-paths'] ?? {}
  const pluginEntry = Object.entries(installerPaths).find(
    ([, types]) => Array.isArray(types) && types.includes('type:wordpress-plugin')
  )

  return pluginEntry ? pluginEntry[0].replace(/\/?\{\$name\}\/?$/, '') : null
}
