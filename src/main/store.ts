import Store from 'electron-store'
import type { Project, ProjectScanSummaries, RepositorySummary } from '../shared/types'

type StoreSchema = {
  projects: Project[]
  scanSummaries: ProjectScanSummaries
  encryptedGitHubToken?: string
  encryptedWordfenceKey?: string
  cachedRepositories?: RepositorySummary[]
  backgroundChecks: boolean
  lastScanAllAt?: string
  // Critical vulnerabilities already notified about, so each one is only announced once.
  notifiedVulnerabilities: string[]
}

export const store = new Store<StoreSchema>({
  name: 'pluginpilot',
  defaults: {
    projects: [],
    scanSummaries: {},
    backgroundChecks: false,
    notifiedVulnerabilities: []
  }
})
