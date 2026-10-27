// Hover classes use "[a]:hover:" so they replace the Badge's own hover style for links.
type EnvironmentColor = {
  badge: string
  dot: string
}

const COLORS = {
  blue: {
    badge:
      'bg-blue-100 text-blue-800 [a]:hover:bg-blue-200 dark:[a]:hover:bg-blue-900 dark:bg-blue-950 dark:text-blue-300',
    dot: 'bg-blue-500'
  },
  amber: {
    badge:
      'bg-amber-100 text-amber-800 [a]:hover:bg-amber-200 dark:[a]:hover:bg-amber-900 dark:bg-amber-950 dark:text-amber-300',
    dot: 'bg-amber-500'
  },
  emerald: {
    badge:
      'bg-emerald-100 text-emerald-800 [a]:hover:bg-emerald-200 dark:[a]:hover:bg-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    dot: 'bg-emerald-500'
  },
  violet: {
    badge:
      'bg-violet-100 text-violet-800 [a]:hover:bg-violet-200 dark:[a]:hover:bg-violet-900 dark:bg-violet-950 dark:text-violet-300',
    dot: 'bg-violet-500'
  },
  pink: {
    badge:
      'bg-pink-100 text-pink-800 [a]:hover:bg-pink-200 dark:[a]:hover:bg-pink-900 dark:bg-pink-950 dark:text-pink-300',
    dot: 'bg-pink-500'
  },
  cyan: {
    badge:
      'bg-cyan-100 text-cyan-800 [a]:hover:bg-cyan-200 dark:[a]:hover:bg-cyan-900 dark:bg-cyan-950 dark:text-cyan-300',
    dot: 'bg-cyan-500'
  }
} satisfies Record<string, EnvironmentColor>

// Common environment names always get the same color, matching the usual dev → prod order.
const KNOWN_ENVIRONMENT_COLORS: Record<string, EnvironmentColor> = {
  development: COLORS.blue,
  develop: COLORS.blue,
  dev: COLORS.blue,
  staging: COLORS.amber,
  stage: COLORS.amber,
  preprod: COLORS.amber,
  production: COLORS.emerald,
  prod: COLORS.emerald,
  live: COLORS.emerald
}

const OTHER_COLORS = [COLORS.violet, COLORS.pink, COLORS.cyan]

// Other names get a color derived from the name, so it stays the same everywhere.
export function getEnvironmentColor(name: string): EnvironmentColor {
  const key = name.trim().toLowerCase()
  const known = KNOWN_ENVIRONMENT_COLORS[key]

  if (known) {
    return known
  }

  const hash = [...key].reduce((total, character) => total + character.charCodeAt(0), 0)
  return OTHER_COLORS[hash % OTHER_COLORS.length]
}
