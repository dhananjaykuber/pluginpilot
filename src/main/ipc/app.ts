import { app, ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'

export function registerAppHandlers(): void {
  ipcMain.handle(IpcChannels.appGetVersion, () => app.getVersion())
}
