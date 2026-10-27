import type { GitHubUser, Project } from './types'

export const IpcChannels = {
  appGetVersion: 'app:get-version',
  authGetUser: 'auth:get-user',
  authConnect: 'auth:connect',
  authDisconnect: 'auth:disconnect',
  projectsList: 'projects:list'
} as const

export type PluginPilotApi = {
  app: {
    getVersion: () => Promise<string>
  }
  auth: {
    getUser: () => Promise<GitHubUser | null>
    connect: (token: string) => Promise<GitHubUser>
    disconnect: () => Promise<void>
  }
  projects: {
    list: () => Promise<Project[]>
  }
}
