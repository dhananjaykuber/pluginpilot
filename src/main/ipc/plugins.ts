import { BrowserWindow, ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import type { PluginUpdateProgress, PluginUpdateRequest } from '../../shared/types'
import { scanProjectPlugins } from '../services/pluginScan'
import { listUpdatePullRequests, updatePlugin } from '../services/pluginUpdate'
import { chooseUploadedZip, type ExpectedPlugin } from '../services/uploadedZips'
import { getPluginReleases } from '../services/wordpressOrg'

export function registerPluginHandlers(): void {
  ipcMain.handle(IpcChannels.pluginsScan, (_event, projectId: string, branch: string) =>
    scanProjectPlugins(projectId, branch)
  )
  ipcMain.handle(IpcChannels.pluginsGetReleases, (_event, slugs: string[]) =>
    getPluginReleases(slugs)
  )
  ipcMain.handle(
    IpcChannels.pluginsListUpdatePullRequests,
    (_event, projectId: string, baseBranch: string) => listUpdatePullRequests(projectId, baseBranch)
  )
  ipcMain.handle(IpcChannels.pluginsChooseZip, (event, expected: ExpectedPlugin) =>
    chooseUploadedZip(BrowserWindow.fromWebContents(event.sender), expected)
  )
  ipcMain.handle(IpcChannels.pluginsUpdate, (event, request: PluginUpdateRequest) =>
    updatePlugin(request, (step) => {
      const progress: PluginUpdateProgress = { updateId: request.updateId, step }
      event.sender.send(IpcChannels.pluginsUpdateProgress, progress)
    })
  )
}
