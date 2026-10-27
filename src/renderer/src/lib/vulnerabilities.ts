import type { PluginVulnerability, VulnerabilitySeverity } from '@shared/types'

const SEVERITY_ORDER: VulnerabilitySeverity[] = ['critical', 'high', 'medium', 'low', 'none']

export const severityLabels: Record<VulnerabilitySeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None'
}

export const severityBadgeClasses: Record<VulnerabilitySeverity, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
  low: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
  none: 'bg-muted text-muted-foreground'
}

// Unscored vulnerabilities count as medium so they still stand out.
export function getHighestSeverity(vulnerabilities: PluginVulnerability[]): VulnerabilitySeverity {
  const severities = vulnerabilities.map((vulnerability) => vulnerability.severity ?? 'medium')

  return SEVERITY_ORDER.find((severity) => severities.includes(severity)) ?? 'medium'
}
