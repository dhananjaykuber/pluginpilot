const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' '
}

// WordPress.org returns plugin names with entities, e.g. "Yoast SEO &#8211; Advanced SEO".
export function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith('#x') || code.startsWith('#X')) {
      return String.fromCodePoint(parseInt(code.slice(2), 16))
    }

    if (code.startsWith('#')) {
      return String.fromCodePoint(parseInt(code.slice(1), 10))
    }

    return NAMED_ENTITIES[code.toLowerCase()] ?? entity
  })
}
