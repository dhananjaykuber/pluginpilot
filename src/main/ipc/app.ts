import { app, ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import type { AppUpdate } from '../../shared/types'
import { checkForAppUpdate, downloadAppUpdate } from '../services/appUpdate'

export function registerAppHandlers(): void {
  ipcMain.handle(IpcChannels.appGetVersion, () => app.getVersion())
  ipcMain.handle(IpcChannels.appCheckForUpdate, () => checkForAppUpdate())
  ipcMain.handle(IpcChannels.appDownloadUpdate, (_event, update: AppUpdate) =>
    downloadAppUpdate(update)
  )
}
