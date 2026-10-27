import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import { scanProjectPlugins } from '../services/pluginScan'

export function registerPluginHandlers(): void {
  ipcMain.handle(IpcChannels.pluginsScan, (_event, projectId: string, branch: string) =>
    scanProjectPlugins(projectId, branch)
  )
}
