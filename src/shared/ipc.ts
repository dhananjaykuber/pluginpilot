import type { DeviceCodePrompt, GitHubUser, Project } from './types'

export const IpcChannels = {
  appGetVersion: 'app:get-version',
  authGetUser: 'auth:get-user',
  authStartSignIn: 'auth:start-sign-in',
  authCompleteSignIn: 'auth:complete-sign-in',
  authCancelSignIn: 'auth:cancel-sign-in',
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
    startSignIn: () => Promise<DeviceCodePrompt>
    completeSignIn: () => Promise<GitHubUser>
    cancelSignIn: () => Promise<void>
    connect: (token: string) => Promise<GitHubUser>
    disconnect: () => Promise<void>
  }
  projects: {
    list: () => Promise<Project[]>
  }
}
