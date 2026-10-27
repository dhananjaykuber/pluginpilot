export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`
}

const relativeTimeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60]
]

// "just now", "5 minutes ago", "yesterday"
export function formatRelativeTime(isoDate: string): string {
  const secondsAgo = Math.round((Date.now() - new Date(isoDate).getTime()) / 1000)

  for (const [unit, seconds] of RELATIVE_TIME_UNITS) {
    if (secondsAgo >= seconds) {
      return relativeTimeFormat.format(-Math.floor(secondsAgo / seconds), unit)
    }
  }

  return 'just now'
}
