import type {
  AppSettings,
  GitHubUser,
  NewProject,
  PluginReleases,
  PluginScan,
  PluginVersion,
  Project,
  RepositorySetup,
  RepositorySummary,
  VulnerabilityReport
} from './types'

export const IpcChannels = {
  appGetVersion: 'app:get-version',
  authGetUser: 'auth:get-user',
  authConnect: 'auth:connect',
  authDisconnect: 'auth:disconnect',
  projectsList: 'projects:list',
  projectsAdd: 'projects:add',
  pluginsScan: 'plugins:scan',
  pluginsGetReleases: 'plugins:get-releases',
  repositoriesList: 'repositories:list',
  repositoriesDetectSetup: 'repositories:detect-setup',
  settingsGet: 'settings:get',
  settingsSetWordfenceKey: 'settings:set-wordfence-key',
  settingsClearWordfenceKey: 'settings:clear-wordfence-key',
  vulnerabilitiesCheck: 'vulnerabilities:check'
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
  plugins: {
    scan: (projectId: string, branch: string) => Promise<PluginScan>
    getReleases: (slugs: string[]) => Promise<PluginReleases>
  }
  repositories: {
    list: () => Promise<RepositorySummary[]>
    detectSetup: (owner: string, repo: string, branch: string) => Promise<RepositorySetup>
  }
  settings: {
    get: () => Promise<AppSettings>
    setWordfenceKey: (apiKey: string) => Promise<AppSettings>
    clearWordfenceKey: () => Promise<AppSettings>
  }
  vulnerabilities: {
    // Resolves to null when no Wordfence API key is configured.
    check: (plugins: PluginVersion[]) => Promise<VulnerabilityReport | null>
  }
}
