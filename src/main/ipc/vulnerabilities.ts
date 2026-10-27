import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import type { PluginVersion } from '../../shared/types'
import { checkPluginVulnerabilities } from '../services/vulnerabilities'

export function registerVulnerabilityHandlers(): void {
  ipcMain.handle(IpcChannels.vulnerabilitiesCheck, (_event, plugins: PluginVersion[]) =>
    checkPluginVulnerabilities(plugins)
  )
}
