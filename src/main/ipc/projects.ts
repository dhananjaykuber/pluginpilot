import { BrowserWindow, ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import type { NewProject, ProjectChanges, ScanSummary } from '../../shared/types'
import { addProject, deleteProject, listProjects, updateProject } from '../services/projects'
import { exportProjects, importProjects } from '../services/projectTransfer'
import { scanAllAndAnnounce } from '../services/scanAlerts'
import { listScanSummaries, saveScanSummary } from '../services/scanSummaries'

export function registerProjectHandlers(): void {
  ipcMain.handle(IpcChannels.projectsList, () => listProjects())
  ipcMain.handle(IpcChannels.projectsAdd, (_event, input: NewProject) => addProject(input))
  ipcMain.handle(IpcChannels.projectsUpdate, (_event, projectId: string, changes: ProjectChanges) =>
    updateProject(projectId, changes)
  )
  ipcMain.handle(IpcChannels.projectsDelete, (_event, projectId: string) =>
    deleteProject(projectId)
  )
  ipcMain.handle(IpcChannels.projectsExport, (event) =>
    exportProjects(BrowserWindow.fromWebContents(event.sender))
  )
  ipcMain.handle(IpcChannels.projectsImport, (event) =>
    importProjects(BrowserWindow.fromWebContents(event.sender))
  )
  ipcMain.handle(IpcChannels.projectsListScanSummaries, () => listScanSummaries())
  ipcMain.handle(
    IpcChannels.projectsSaveScanSummary,
    (_event, projectId: string, environmentName: string, summary: ScanSummary) =>
      saveScanSummary(projectId, environmentName, summary)
  )
  ipcMain.handle(IpcChannels.projectsScanAll, () => scanAllAndAnnounce())
}
