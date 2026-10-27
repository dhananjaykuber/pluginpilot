import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import { listAccessibleRepositories } from '../services/repositories'

export function registerRepositoryHandlers(): void {
  ipcMain.handle(IpcChannels.repositoriesList, () => listAccessibleRepositories())
}
