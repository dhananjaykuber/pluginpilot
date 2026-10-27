import type { InstalledPlugin, PluginSource } from '@shared/types'

export const pluginSourceLabels: Record<PluginSource, string> = {
  composer: 'Composer',
  manual: 'Manual'
}

export function filterPlugins(plugins: InstalledPlugin[], search: string): InstalledPlugin[] {
  const query = search.trim().toLowerCase()

  if (!query) {
    return plugins
  }

  return plugins.filter(
    (plugin) =>
      plugin.name.toLowerCase().includes(query) || plugin.slug.toLowerCase().includes(query)
  )
}
