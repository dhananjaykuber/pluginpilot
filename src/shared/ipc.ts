import type { GitHubUser, NewProject, Project, RepositorySetup, RepositorySummary } from './types'

export const IpcChannels = {
  appGetVersion: 'app:get-version',
  authGetUser: 'auth:get-user',
  authConnect: 'auth:connect',
  authDisconnect: 'auth:disconnect',
  projectsList: 'projects:list',
  projectsAdd: 'projects:add',
  repositoriesList: 'repositories:list',
  repositoriesDetectSetup: 'repositories:detect-setup'
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
    add: (project: NewProject) => Promise<Project>
  }
  repositories: {
    list: () => Promise<RepositorySummary[]>
    detectSetup: (owner: string, repo: string, branch: string) => Promise<RepositorySetup>
  }
}
