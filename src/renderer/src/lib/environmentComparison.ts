import type { InstalledPlugin, PluginScan } from '@shared/types'
import { compareVersions } from '@shared/versions'
import { shortenPluginName } from './plugins'

export type ComparisonStatus = 'same' | 'newest' | 'behind' | 'missing'

export type ComparisonCell = {
  version: string | null
  status: ComparisonStatus
}

export type ComparisonRow = {
  slug: string
  name: string
  // One cell per environment; null while that environment hasn't been scanned.
  cells: (ComparisonCell | null)[]
  differs: boolean
}

// Lines up each plugin's version across environments. `scans` follows the column order and
// holds undefined for environments that haven't been scanned yet.
export function buildComparisonRows(scans: (PluginScan | undefined)[]): ComparisonRow[] {
  const slugs = new Set(scans.flatMap((scan) => scan?.plugins.map((plugin) => plugin.slug) ?? []))

  return [...slugs]
    .map((slug) => buildRow(slug, scans))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function buildRow(slug: string, scans: (PluginScan | undefined)[]): ComparisonRow {
  // undefined: not scanned yet, null: not installed in that environment.
  const plugins = scans.map((scan) =>
    scan ? (scan.plugins.find((plugin) => plugin.slug === slug) ?? null) : undefined
  )
  const scanned = plugins.filter((plugin) => plugin !== undefined)
  const differs = new Set(scanned.map(describeVersion)).size > 1
  const newest = findNewestVersion(scanned)
  const name = scanned.find((plugin) => plugin)?.name ?? slug

  return {
    slug,
    name: shortenPluginName(name),
    differs,
    cells: plugins.map((plugin) => {
      if (plugin === undefined) {
        return null
      }

      if (plugin === null) {
        return { version: null, status: 'missing' }
      }

      const isNewest = plugin.version === newest
      return { version: plugin.version, status: !differs ? 'same' : isNewest ? 'newest' : 'behind' }
    })
  }
}

function describeVersion(plugin: InstalledPlugin | null): string {
  return plugin ? (plugin.version ?? 'unknown') : 'missing'
}

function findNewestVersion(plugins: (InstalledPlugin | null)[]): string | null {
  const versions = plugins.flatMap((plugin) => (plugin?.version ? [plugin.version] : []))

  return versions.reduce<string | null>(
    (newest, version) =>
      newest === null || compareVersions(version, newest) > 0 ? version : newest,
    null
  )
}
