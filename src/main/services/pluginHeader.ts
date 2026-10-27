// WordPress only reads the first 8 KB of a plugin file when looking for its header.
const HEADER_LENGTH = 8192

export type PluginHeader = {
  name: string
  version: string | null
}

// Mirrors WordPress get_file_data(): returns null when the file has no "Plugin Name" header.
export function parsePluginHeader(contents: string): PluginHeader | null {
  const header = contents.slice(0, HEADER_LENGTH)
  const name = readHeaderField(header, 'Plugin Name')

  if (!name) {
    return null
  }

  return { name, version: readHeaderField(header, 'Version') }
}

function readHeaderField(header: string, field: string): string | null {
  const match = header.match(new RegExp(`^[ \\t/*#@]*${field}:(.*)$`, 'mi'))
  const value = match?.[1].replace(/\s*(?:\*\/|\?>).*$/, '').trim()

  return value || null
}
