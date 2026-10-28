import type {
  CriticalVulnerability,
  EnvironmentScanResult,
  Environment,
  Project,
  ScanAllProgress,
  ScanAllResult
} from '../../shared/types'
import { isNewerVersion } from '../../shared/versions'
import { store } from '../store'
import { mapWithConcurrency } from './concurrency'
import { getPluginReleases } from './pluginReleases'
import { scanProjectPlugins } from './pluginScan'
import { listProjects } from './projects'
import { saveScanSummary } from './scanSummaries'
import { checkPluginVulnerabilities } from './vulnerabilities'

// Each environment scan already makes many GitHub requests in parallel.
const ENVIRONMENT_CONCURRENCY = 3

type ScanTarget = { project: Project; environment: Environment }
// `key` identifies one vulnerability on one environment, to remember what was notified.
type FoundVulnerability = { key: string; vulnerability: CriticalVulnerability }
type CheckedEnvironment = { result: EnvironmentScanResult; critical: FoundVulnerability[] }

let running: Promise<ScanAllResult> | null = null

// Scans every environment of every project, like opening each one and clicking Scan. A second
// call while one is running gets the same result instead of starting another.
export function scanAllProjects(
  onProgress: (progress: ScanAllProgress) => void
): Promise<ScanAllResult> {
  running ??= runScanAll(onProgress).finally(() => {
    running = null
  })
  return running
}

async function runScanAll(onProgress: (progress: ScanAllProgress) => void): Promise<ScanAllResult> {
  const targets = listProjects().flatMap((project) =>
    project.environments.map((environment) => ({ project, environment }))
  )
  let done = 0
  onProgress({ done, total: targets.length })

  const checked = await mapWithConcurrency(targets, ENVIRONMENT_CONCURRENCY, async (target) => {
    const result = await checkEnvironment(target)
    onProgress({ done: ++done, total: targets.length })
    return result
  })

  const critical = checked.flatMap((environment) => environment.critical)
  const failed = checked
    .filter((environment) => environment.result.error)
    .map((environment) => environmentKey(environment.result))
  store.set('lastScanAllAt', new Date().toISOString())

  return {
    results: checked.map((environment) => environment.result),
    criticalCount: critical.length,
    newCritical: rememberNotified(critical, failed).map((found) => found.vulnerability)
  }
}

// Scans one environment and saves the same summary the Projects page shows after a manual scan.
async function checkEnvironment({ project, environment }: ScanTarget): Promise<CheckedEnvironment> {
  const base = { projectId: project.id, environmentName: environment.name }

  try {
    const scan = await scanProjectPlugins(project.id, environment.branch)
    const [releases, vulnerabilities] = await Promise.all([
      getPluginReleases(scan.plugins.map(({ slug, packageName }) => ({ slug, packageName }))),
      checkPluginVulnerabilities(scan.plugins.map(({ slug, version }) => ({ slug, version })))
    ])

    const updateCount = scan.plugins.filter((plugin) => {
      const release = releases[plugin.slug]
      return release && plugin.version && isNewerVersion(release.latestVersion, plugin.version)
    }).length
    const vulnerablePlugins = scan.plugins.filter(
      (plugin) => vulnerabilities?.bySlug[plugin.slug]?.length
    )

    saveScanSummary(project.id, environment.name, {
      scannedAt: scan.scannedAt,
      pluginCount: scan.plugins.length,
      updateCount,
      vulnerableCount: vulnerabilities ? vulnerablePlugins.length : null
    })

    const critical = vulnerablePlugins.flatMap((plugin) =>
      (vulnerabilities?.bySlug[plugin.slug] ?? [])
        .filter((vulnerability) => vulnerability.severity === 'critical')
        .map((vulnerability) => ({
          key: `${environmentKey(base)}${plugin.slug}|${vulnerability.id}`,
          vulnerability: {
            projectId: project.id,
            repoName: `${project.repo.owner}/${project.repo.name}`,
            environmentName: environment.name,
            pluginName: plugin.name,
            title: vulnerability.title
          }
        }))
    )

    return { result: { ...base, scan, error: null }, critical }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { result: { ...base, scan: null, error: message }, critical: [] }
  }
}

function environmentKey({
  projectId,
  environmentName
}: Omit<EnvironmentScanResult, 'scan' | 'error'>): string {
  return `${projectId}|${environmentName}|`
}

// Returns the vulnerabilities not notified about before, and remembers the current ones. A fixed
// vulnerability drops out, so it's announced again if it ever comes back. Environments that
// failed to scan keep what was remembered for them.
function rememberNotified(
  critical: FoundVulnerability[],
  failedEnvironments: string[]
): FoundVulnerability[] {
  const notified = store.get('notifiedVulnerabilities')
  const kept = notified.filter((key) => failedEnvironments.some((prefix) => key.startsWith(prefix)))
  store.set('notifiedVulnerabilities', [...kept, ...critical.map((found) => found.key)])

  const known = new Set(notified)
  return critical.filter((found) => !known.has(found.key))
}
