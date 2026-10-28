import Store from 'electron-store'
import type { Project, ProjectScanSummaries, RepositorySummary } from '../shared/types'

type StoreSchema = {
  projects: Project[]
  scanSummaries: ProjectScanSummaries
  encryptedGitHubToken?: string
  encryptedWordfenceKey?: string
  cachedRepositories?: RepositorySummary[]
}

export const store = new Store<StoreSchema>({
  name: 'pluginpilot',
  defaults: {
    projects: [],
    scanSummaries: {}
  }
})
