import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IpcChannels, type PluginPilotApi } from '../shared/ipc'
import type { PluginUpdateProgress } from '../shared/types'

const api: PluginPilotApi = {
  app: {
    getVersion: () => ipcRenderer.invoke(IpcChannels.appGetVersion),
    checkForUpdate: () => ipcRenderer.invoke(IpcChannels.appCheckForUpdate),
    downloadUpdate: (update) => ipcRenderer.invoke(IpcChannels.appDownloadUpdate, update)
  },
  auth: {
    getUser: () => ipcRenderer.invoke(IpcChannels.authGetUser),
    connect: (token) => ipcRenderer.invoke(IpcChannels.authConnect, token),
    disconnect: () => ipcRenderer.invoke(IpcChannels.authDisconnect)
  },
  projects: {
    list: () => ipcRenderer.invoke(IpcChannels.projectsList),
    add: (project) => ipcRenderer.invoke(IpcChannels.projectsAdd, project),
    update: (projectId, changes) =>
      ipcRenderer.invoke(IpcChannels.projectsUpdate, projectId, changes),
    delete: (projectId) => ipcRenderer.invoke(IpcChannels.projectsDelete, projectId),
    exportAll: () => ipcRenderer.invoke(IpcChannels.projectsExport),
    importAll: () => ipcRenderer.invoke(IpcChannels.projectsImport),
    listScanSummaries: () => ipcRenderer.invoke(IpcChannels.projectsListScanSummaries),
    saveScanSummary: (projectId, environmentName, summary) =>
      ipcRenderer.invoke(IpcChannels.projectsSaveScanSummary, projectId, environmentName, summary)
  },
  plugins: {
    scan: (projectId, branch) => ipcRenderer.invoke(IpcChannels.pluginsScan, projectId, branch),
    getReleases: (plugins) => ipcRenderer.invoke(IpcChannels.pluginsGetReleases, plugins),
    getChangelog: (slug, fromVersion, toVersion) =>
      ipcRenderer.invoke(IpcChannels.pluginsGetChangelog, slug, fromVersion, toVersion),
    findModifications: (request) =>
      ipcRenderer.invoke(IpcChannels.pluginsFindModifications, request),
    listUpdatePullRequests: (projectId, baseBranch) =>
      ipcRenderer.invoke(IpcChannels.pluginsListUpdatePullRequests, projectId, baseBranch),
    chooseZip: (expected) => ipcRenderer.invoke(IpcChannels.pluginsChooseZip, expected),
    update: (request) => ipcRenderer.invoke(IpcChannels.pluginsUpdate, request),
    onUpdateProgress: (listener) => {
      const handleProgress = (_event: IpcRendererEvent, progress: PluginUpdateProgress): void =>
        listener(progress)

      ipcRenderer.on(IpcChannels.pluginsUpdateProgress, handleProgress)
      return () => ipcRenderer.removeListener(IpcChannels.pluginsUpdateProgress, handleProgress)
    }
  },
  repositories: {
    list: () => ipcRenderer.invoke(IpcChannels.repositoriesList),
    listCached: () => ipcRenderer.invoke(IpcChannels.repositoriesListCached),
    detectSetup: (owner, repo, branch) =>
      ipcRenderer.invoke(IpcChannels.repositoriesDetectSetup, owner, repo, branch)
  },
  settings: {
    get: () => ipcRenderer.invoke(IpcChannels.settingsGet),
    setWordfenceKey: (apiKey) => ipcRenderer.invoke(IpcChannels.settingsSetWordfenceKey, apiKey),
    clearWordfenceKey: () => ipcRenderer.invoke(IpcChannels.settingsClearWordfenceKey)
  },
  vulnerabilities: {
    check: (plugins) => ipcRenderer.invoke(IpcChannels.vulnerabilitiesCheck, plugins)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
