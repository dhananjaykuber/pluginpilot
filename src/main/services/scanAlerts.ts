import { app, BrowserWindow, Notification } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import type { CriticalVulnerability, ScanAllResult } from '../../shared/types'
import { scanAllProjects } from './scanAll'

// Runs "Scan all", keeps every window up to date while it runs, then announces the result.
// Used by both the Scan all button and the background checks.
export async function scanAllAndAnnounce(): Promise<ScanAllResult> {
  const result = await scanAllProjects((progress) =>
    broadcast(IpcChannels.projectsScanAllProgress, progress)
  )

  broadcast(IpcChannels.projectsScanAllFinished, result)
  app.dock?.setBadge(result.criticalCount > 0 ? String(result.criticalCount) : '')
  notifyNewCritical(result.newCritical)

  return result
}

function notifyNewCritical(vulnerabilities: CriticalVulnerability[]): void {
  if (vulnerabilities.length === 0 || !Notification.isSupported()) {
    return
  }

  const [first] = vulnerabilities
  const notification = new Notification(
    vulnerabilities.length === 1
      ? {
          title: `Critical vulnerability in ${first.pluginName}`,
          body: `${first.repoName} (${first.environmentName}): ${first.title}`
        }
      : {
          title: `${vulnerabilities.length} new critical vulnerabilities`,
          body: [
            ...new Set(vulnerabilities.map((v) => `${v.repoName} (${v.environmentName})`))
          ].join(', ')
        }
  )

  // Opens the first affected project on the environment with the issue.
  notification.on('click', () => {
    const window = BrowserWindow.getAllWindows()[0]
    if (!window) return
    window.show()
    window.focus()
    window.webContents.send(
      IpcChannels.appNavigate,
      `/projects/${first.projectId}?env=${encodeURIComponent(first.environmentName)}`
    )
  })
  notification.show()
}

function broadcast(channel: string, payload: unknown): void {
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send(channel, payload)
  }
}
