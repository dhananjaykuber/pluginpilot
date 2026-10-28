import { store } from '../store'
import { getGitHubToken } from './githubToken'
import { listProjects } from './projects'
import { scanAllAndAnnounce } from './scanAlerts'

const CHECK_INTERVAL = 6 * 60 * 60 * 1000
// Gives the app a moment to start before the first check after launch.
const FIRST_CHECK_DELAY = 60 * 1000

let timer: NodeJS.Timeout | null = null

// Schedules the next background "Scan all" when they're turned on. Called at startup and
// whenever the setting changes. Checks only run while the app is open.
export function scheduleBackgroundChecks(): void {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  if (!store.get('backgroundChecks')) {
    return
  }

  const lastRun = Date.parse(store.get('lastScanAllAt') ?? '') || 0
  const delay = Math.max(FIRST_CHECK_DELAY, lastRun + CHECK_INTERVAL - Date.now())
  timer = setTimeout(runBackgroundCheck, delay)
}

async function runBackgroundCheck(): Promise<void> {
  try {
    if (getGitHubToken() && listProjects().length > 0) {
      await scanAllAndAnnounce()
    }
  } catch (error) {
    console.error('Background check failed', error)
  } finally {
    // Checks again after the interval, even when this one couldn't run.
    store.set('lastScanAllAt', new Date().toISOString())
    scheduleBackgroundChecks()
  }
}
