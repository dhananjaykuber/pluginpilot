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

export type ProjectExportResult = {
  count: number
  filePath: string
}

export type ProjectImportResult = {
  imported: number
  skipped: number
}

// The parts of a project that can be edited after it is added.
export type ProjectChanges = Pick<Project, 'pluginPaths' | 'environments'>

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
  // Composer package name, e.g. "wpackagist-plugin/wordpress-seo". null for committed plugins.
  packageName: string | null
}

export type PluginScan = {
  branch: string
  scannedAt: string
  plugins: InstalledPlugin[]
}

// Minimum versions a plugin release needs, as stated on WordPress.org.
export type PluginRequirements = {
  wordPress: string | null
  php: string | null
}

export type PluginRelease = {
  slug: string
  name: string
  latestVersion: string
  downloadUrl: string
  requirements: PluginRequirements
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

export type ChangelogEntry = {
  version: string
  notes: string[]
}

export type PluginUpdateDetails = {
  // Lets the renderer match progress events to the update it started.
  updateId: string
  projectId: string
  environmentName: string
  slug: string
  name: string
  path: string
  fromVersion: string
  toVersion: string
  changelogUrl: string | null
  requirements: PluginRequirements | null
  // Release notes between the two versions, when the changelog could be read.
  changelog: ChangelogEntry[]
  securityFixes: { title: string; cve: string | null }[]
}

// Where a committed plugin's new version comes from: WordPress.org, or a zip the user chose.
export type PluginZipSource =
  { from: 'wordpress-org'; url: string } | { from: 'upload'; zipId: string }

// Committed plugins are replaced with the zip's contents; Composer plugins only change
// composer.json and composer.lock.
export type PluginUpdateRequest = PluginUpdateDetails &
  ({ source: 'manual'; zip: PluginZipSource } | { source: 'composer'; packageName: string })

// A zip the user chose, checked to contain a newer version of the expected plugin.
export type UploadedPluginZip = {
  zipId: string
  name: string
  version: string
}

export type PluginUpdateStep = 'prepare' | 'commit' | 'pull-request'

export type PluginUpdateProgress = {
  updateId: string
  step: PluginUpdateStep
}

export type PluginUpdateResult = {
  branch: string
  pullRequestNumber: number
  pullRequestUrl: string
}

export type UpdatePullRequest = {
  number: number
  url: string
  branch: string
}

export type AppSettings = {
  hasWordfenceKey: boolean
}

export type GitHubUser = {
  login: string
  name: string
  avatarUrl: string
}
