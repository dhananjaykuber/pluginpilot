import type { Project } from './types'

export const IpcChannels = {
  appGetVersion: 'app:get-version',
  projectsList: 'projects:list'
} as const

export type PluginPilotApi = {
  app: {
    getVersion: () => Promise<string>
  }
  projects: {
    list: () => Promise<Project[]>
  }
}
