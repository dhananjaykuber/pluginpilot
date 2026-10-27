import type {
  AppSettings,
  ChangelogEntry,
  GitHubUser,
  LocalModificationsRequest,
  NewProject,
  PluginModifications,
  PluginReleases,
  PluginScan,
  PluginUpdateProgress,
  PluginUpdateRequest,
  PluginUpdateResult,
  PluginVersion,
  Project,
  ProjectChanges,
  ProjectExportResult,
  ProjectImportResult,
  RepositorySetup,
  RepositorySummary,
  UpdatePullRequest,
  UploadedPluginZip,
  VulnerabilityReport
} from './types'

export const IpcChannels = {
  appGetVersion: 'app:get-version',
  authGetUser: 'auth:get-user',
  authConnect: 'auth:connect',
  authDisconnect: 'auth:disconnect',
  projectsList: 'projects:list',
  projectsAdd: 'projects:add',
  projectsUpdate: 'projects:update',
  projectsDelete: 'projects:delete',
  projectsExport: 'projects:export',
  projectsImport: 'projects:import',
  pluginsScan: 'plugins:scan',
  pluginsGetReleases: 'plugins:get-releases',
  pluginsGetChangelog: 'plugins:get-changelog',
  pluginsFindModifications: 'plugins:find-modifications',
  pluginsListUpdatePullRequests: 'plugins:list-update-pull-requests',
  pluginsChooseZip: 'plugins:choose-zip',
  pluginsUpdate: 'plugins:update',
  pluginsUpdateProgress: 'plugins:update-progress',
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
    update: (projectId: string, changes: ProjectChanges) => Promise<Project>
    delete: (projectId: string) => Promise<void>
    // Both resolve to null when the user cancels the file dialog.
    exportAll: () => Promise<ProjectExportResult | null>
    importAll: () => Promise<ProjectImportResult | null>
  }
  plugins: {
    scan: (projectId: string, branch: string) => Promise<PluginScan>
    getReleases: (slugs: string[]) => Promise<PluginReleases>
    getChangelog: (
      slug: string,
      fromVersion: string,
      toVersion: string
    ) => Promise<ChangelogEntry[]>
    findModifications: (request: LocalModificationsRequest) => Promise<PluginModifications>
    listUpdatePullRequests: (projectId: string, baseBranch: string) => Promise<UpdatePullRequest[]>
    // Resolves to null when the user cancels the file picker.
    chooseZip: (expected: { name: string; version: string }) => Promise<UploadedPluginZip | null>
    update: (request: PluginUpdateRequest) => Promise<PluginUpdateResult>
    // Returns a function that stops listening.
    onUpdateProgress: (listener: (progress: PluginUpdateProgress) => void) => () => void
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
