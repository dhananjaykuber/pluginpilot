import type { ChangelogEntry } from '../../shared/types'
import { compareVersions, isNewerVersion } from '../../shared/versions'
import { decodeHtmlEntities } from './htmlEntities'

// Matches the version at the start of a heading, e.g. "2.5.2 – 2026-10-26" or "v6.2".
const HEADING_VERSION = /^\s*v?(\d+(?:\.\d+)+[\w.-]*)/i

// Keeps changelog entries newer than `fromVersion`, up to and including `toVersion`.
export function selectChangelogEntries(
  entries: ChangelogEntry[],
  fromVersion: string,
  toVersion: string
): ChangelogEntry[] {
  return entries.filter(
    ({ version }) =>
      isNewerVersion(version, fromVersion) && compareVersions(version, toVersion) <= 0
  )
}

// Parses a WordPress.org changelog section. Each heading with a version starts an entry;
// headings without one, like "Enhancements", become a note in the current entry.
export function parseChangelog(html: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = []
  const sections = html.split(/<h[1-6][^>]*>/i).slice(1)

  for (const section of sections) {
    const [headingHtml, bodyHtml = ''] = section.split(/<\/h[1-6]>/i)
    const heading = toPlainText(headingHtml)
    const version = heading.match(HEADING_VERSION)?.[1]
    const notes = extractNotes(bodyHtml)

    if (version) {
      entries.push({ version, notes })
    } else if (entries.length > 0) {
      entries[entries.length - 1].notes.push(`${heading}:`, ...notes)
    }
  }

  return entries
}

// List items become notes; paragraphs are used when there is no list.
function extractNotes(html: string): string[] {
  const listItems = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((match) => match[1])
  const blocks =
    listItems.length > 0
      ? listItems
      : [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => match[1])

  return blocks.map(toPlainText).filter(Boolean)
}

function toPlainText(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim()
}
