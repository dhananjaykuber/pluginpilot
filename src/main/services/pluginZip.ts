import AdmZip from 'adm-zip'
import { parsePluginHeader, type PluginHeader } from './pluginHeader'

export type PluginFile = {
  // Relative to the plugin folder, e.g. "includes/class-safe-svg.php".
  path: string
  content: Buffer
}

export async function downloadPluginZip(url: string): Promise<Buffer> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Couldn't download the plugin zip (status ${response.status}).`)
  }

  return Buffer.from(await response.arrayBuffer())
}

// WordPress.org zips wrap the plugin in a "<slug>/" folder, which is removed here.
export function extractPluginFiles(zip: Buffer): PluginFile[] {
  const files = new AdmZip(zip)
    .getEntries()
    .filter((entry) => !entry.isDirectory && !isArchiveJunk(entry.entryName))
    .map((entry) => ({ path: entry.entryName, content: entry.getData() }))

  const rootFolder = getSharedRootFolder(files.map((file) => file.path))

  if (!rootFolder) {
    return files
  }

  return files.map((file) => ({ ...file, path: file.path.slice(rootFolder.length + 1) }))
}

// Reads the main plugin file's header: a top-level PHP file with a "Plugin Name" header.
export function readPluginHeader(files: PluginFile[]): PluginHeader | null {
  for (const file of files) {
    if (file.path.includes('/') || !file.path.endsWith('.php')) {
      continue
    }

    const header = parsePluginHeader(file.content.toString('utf8'))

    if (header) {
      return header
    }
  }

  return null
}

function getSharedRootFolder(paths: string[]): string | null {
  const firstFolder = paths[0]?.split('/')[0]

  if (!firstFolder || !paths.every((path) => path.startsWith(`${firstFolder}/`))) {
    return null
  }

  return firstFolder
}

// Files added by macOS when zipping in Finder, which don't belong in the plugin.
function isArchiveJunk(path: string): boolean {
  return path.startsWith('__MACOSX/') || path.split('/').pop() === '.DS_Store'
}
