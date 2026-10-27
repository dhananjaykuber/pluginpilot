export type Environment = {
  name: string
  branch: string
}

export type Project = {
  id: string
  repo: {
    owner: string
    name: string
  }
  pluginPaths: string[]
  environments: Environment[]
  createdAt: string
}

export type NewProject = Omit<Project, 'id' | 'createdAt'>

export type RepositorySummary = {
  owner: string
  name: string
  fullName: string
  isPrivate: boolean
  defaultBranch: string
  ownerAvatarUrl: string
}

export type PluginFolder = {
  path: string
  pluginCount: number
}

export type ComposerSetup = {
  hasLock: boolean
  isValid: boolean
  pluginPackageCount: number
  installerPath: string | null
}

export type RepositorySetup = {
  branch: string
  pluginFolders: PluginFolder[]
  composer: ComposerSetup | null
  branches: string[]
}

export type PluginSource = 'composer' | 'manual'

export type InstalledPlugin = {
  slug: string
  name: string
  version: string | null
  source: PluginSource
  path: string
}

export type PluginScan = {
  branch: string
  scannedAt: string
  plugins: InstalledPlugin[]
}

export type PluginRelease = {
  slug: string
  name: string
  latestVersion: string
  downloadUrl: string
}

// Latest WordPress.org release per slug; null when the plugin isn't on WordPress.org.
export type PluginReleases = Record<string, PluginRelease | null>

export type PluginVersion = {
  slug: string
  version: string | null
}

export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low' | 'none'

export type PluginVulnerability = {
  id: string
  title: string
  severity: VulnerabilitySeverity | null
  cvssScore: number | null
  cve: string | null
  patchedVersions: string[]
  url: string | null
}

export type VulnerabilityReport = {
  feedUpdatedAt: string
  bySlug: Record<string, PluginVulnerability[]>
}

export type PluginUpdateRequest = {
  // Lets the renderer match progress events to the update it started.
  updateId: string
  projectId: string
  environmentName: string
  slug: string
  name: string
  path: string
  fromVersion: string
  toVersion: string
  downloadUrl: string
  securityFixes: { title: string; cve: string | null }[]
}

export type PluginUpdateStep = 'download' | 'commit' | 'pull-request'

export type PluginUpdateProgress = {
  updateId: string
  step: PluginUpdateStep
}

export type PluginUpdateResult = {
  branch: string
  pullRequestNumber: number
  pullRequestUrl: string
}

export type AppSettings = {
  hasWordfenceKey: boolean
}

export type GitHubUser = {
  login: string
  name: string
  avatarUrl: string
}
