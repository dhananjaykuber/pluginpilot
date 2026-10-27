import Store from 'electron-store'
import type { Project, ProjectScanSummaries } from '../shared/types'

type StoreSchema = {
  projects: Project[]
  scanSummaries: ProjectScanSummaries
  encryptedGitHubToken?: string
  encryptedWordfenceKey?: string
}

export const store = new Store<StoreSchema>({
  name: 'pluginpilot',
  defaults: {
    projects: [],
    scanSummaries: {}
  }
})
