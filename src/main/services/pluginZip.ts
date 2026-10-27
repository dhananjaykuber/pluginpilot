import AdmZip from 'adm-zip'
import { parsePluginHeader } from './pluginHeader'

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
    .filter((entry) => !entry.isDirectory)
    .map((entry) => ({ path: entry.entryName, content: entry.getData() }))

  const rootFolder = getSharedRootFolder(files.map((file) => file.path))

  if (!rootFolder) {
    return files
  }

  return files.map((file) => ({ ...file, path: file.path.slice(rootFolder.length + 1) }))
}

// Reads the version from the main plugin file: a top-level PHP file with a plugin header.
export function readPluginVersion(files: PluginFile[]): string | null {
  for (const file of files) {
    if (file.path.includes('/') || !file.path.endsWith('.php')) {
      continue
    }

    const header = parsePluginHeader(file.content.toString('utf8'))

    if (header) {
      return header.version
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
