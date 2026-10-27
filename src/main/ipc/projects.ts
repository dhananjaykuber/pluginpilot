import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import type { NewProject, ProjectChanges } from '../../shared/types'
import { addProject, deleteProject, listProjects, updateProject } from '../services/projects'

export function registerProjectHandlers(): void {
  ipcMain.handle(IpcChannels.projectsList, () => listProjects())
  ipcMain.handle(IpcChannels.projectsAdd, (_event, input: NewProject) => addProject(input))
  ipcMain.handle(IpcChannels.projectsUpdate, (_event, projectId: string, changes: ProjectChanges) =>
    updateProject(projectId, changes)
  )
  ipcMain.handle(IpcChannels.projectsDelete, (_event, projectId: string) =>
    deleteProject(projectId)
  )
}
