import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import { scanProjectPlugins } from '../services/pluginScan'
import { getPluginReleases } from '../services/wordpressOrg'

export function registerPluginHandlers(): void {
  ipcMain.handle(IpcChannels.pluginsScan, (_event, projectId: string, branch: string) =>
    scanProjectPlugins(projectId, branch)
  )
  ipcMain.handle(IpcChannels.pluginsGetReleases, (_event, slugs: string[]) =>
    getPluginReleases(slugs)
  )
}
