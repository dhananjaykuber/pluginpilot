import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IpcChannels, type PluginPilotApi } from '../shared/ipc'
import type { PluginUpdateProgress } from '../shared/types'

const api: PluginPilotApi = {
  app: {
    getVersion: () => ipcRenderer.invoke(IpcChannels.appGetVersion)
  },
  auth: {
    getUser: () => ipcRenderer.invoke(IpcChannels.authGetUser),
    connect: (token) => ipcRenderer.invoke(IpcChannels.authConnect, token),
    disconnect: () => ipcRenderer.invoke(IpcChannels.authDisconnect)
  },
  projects: {
    list: () => ipcRenderer.invoke(IpcChannels.projectsList),
    add: (project) => ipcRenderer.invoke(IpcChannels.projectsAdd, project)
  },
  plugins: {
    scan: (projectId, branch) => ipcRenderer.invoke(IpcChannels.pluginsScan, projectId, branch),
    getReleases: (slugs) => ipcRenderer.invoke(IpcChannels.pluginsGetReleases, slugs),
    listUpdatePullRequests: (projectId, baseBranch) =>
      ipcRenderer.invoke(IpcChannels.pluginsListUpdatePullRequests, projectId, baseBranch),
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
