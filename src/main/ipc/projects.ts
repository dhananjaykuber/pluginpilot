import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import type { NewProject } from '../../shared/types'
import { addProject, listProjects } from '../services/projects'

export function registerProjectHandlers(): void {
  ipcMain.handle(IpcChannels.projectsList, () => listProjects())
  ipcMain.handle(IpcChannels.projectsAdd, (_event, input: NewProject) => addProject(input))
}
