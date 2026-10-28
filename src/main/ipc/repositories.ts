import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import { getCachedRepositories } from '../services/repositoryCache'
import { listAccessibleRepositories } from '../services/repositories'
import { detectRepositorySetup } from '../services/repositorySetup'

export function registerRepositoryHandlers(): void {
  ipcMain.handle(IpcChannels.repositoriesList, () => listAccessibleRepositories())
  ipcMain.handle(IpcChannels.repositoriesListCached, () => getCachedRepositories())
  ipcMain.handle(
    IpcChannels.repositoriesDetectSetup,
    (_event, owner: string, repo: string, branch: string) =>
      detectRepositorySetup(owner, repo, branch)
  )
}
