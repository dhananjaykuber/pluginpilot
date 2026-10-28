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
  // Added to every update pull request. Missing on projects saved before labels existed.
  labels?: string[]
  createdAt: string
}

export type NewProject = Omit<Project, 'id' | 'createdAt'>

export type ScanSummary = {
  scannedAt: string
  pluginCount: number
  updateCount: number
  // null when vulnerabilities weren't checked because no Wordfence key is set.
  vulnerableCount: number | null
}

// Last scan summary by project ID, then by environment name.
export type ProjectScanSummaries = Record<string, Record<string, ScanSummary>>

export type ProjectExportResult = {
  count: number
  filePath: string
}

export type ProjectImportResult = {
  imported: number
  skipped: number
}

// The parts of a project that can be edited after it is added.
export type ProjectChanges = Pick<Project, 'pluginPaths' | 'environments' | 'labels'>

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

export type ReleaseSource = 'wordpress-org' | 'rtcamp'

// The latest release of a plugin. rtCamp packages only provide the version: their downloads
// need Composer credentials and they don't state a name or requirements.
export type PluginRelease = {
  slug: string
  source: ReleaseSource
  name: string | null
  latestVersion: string
  downloadUrl: string | null
  requirements: PluginRequirements | null
}

// What's needed to look up a plugin's latest release.
export type PluginReleaseQuery = {
  slug: string
  packageName: string | null
}

// Latest release per slug; null when neither WordPress.org nor rtCamp packages have it.
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

export type LocalModificationsRequest = {
  projectId: string
  environmentName: string
  slug: string
  path: string
  version: string
}

export type PluginFileChange = {
  // Relative to the plugin folder.
  path: string
  kind: 'modified' | 'added' | 'removed'
}

// "unknown" when the original version can't be downloaded from WordPress.org.
export type PluginModifications = {
  status: 'unmodified' | 'modified' | 'unknown'
  changes: PluginFileChange[]
  totalChanges: number
}

export type PluginUpdateProgress = {
  updateId: string
  step: PluginUpdateStep
}

export type PluginUpdateResult = {
  branch: string
  pullRequestNumber: number
  pullRequestUrl: string
}

export type ChecksStatus = 'passing' | 'failing' | 'pending' | 'none'

export type ReviewStatus = 'approved' | 'changes-requested' | 'pending'

export type UpdatePullRequest = {
  number: number
  url: string
  branch: string
  checks: ChecksStatus
  review: ReviewStatus
}

export type AppSettings = {
  hasWordfenceKey: boolean
  // Scan all projects every few hours while the app is open, and notify about new critical issues.
  backgroundChecks: boolean
}

// One environment checked by "Scan all". `scan` is null when it failed, with `error` saying why.
export type EnvironmentScanResult = {
  projectId: string
  environmentName: string
  scan: PluginScan | null
  error: string | null
}

export type CriticalVulnerability = {
  projectId: string
  repoName: string
  environmentName: string
  pluginName: string
  title: string
}

export type ScanAllResult = {
  results: EnvironmentScanResult[]
  // Critical vulnerabilities found across all projects, and the ones not reported before.
  criticalCount: number
  newCritical: CriticalVulnerability[]
}

export type ScanAllProgress = {
  done: number
  total: number
}

// A newer PluginPilot release on GitHub.
export type AppUpdate = {
  version: string
  releaseUrl: string
  installerId: number
  installerName: string
}

export type GitHubUser = {
  login: string
  name: string
  avatarUrl: string
}
