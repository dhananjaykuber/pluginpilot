import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import { store } from '../store'

export function registerProjectHandlers(): void {
  ipcMain.handle(IpcChannels.projectsList, () => store.get('projects'))
}
