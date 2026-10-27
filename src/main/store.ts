import Store from 'electron-store'
import type { Project } from '../shared/types'

type StoreSchema = {
  projects: Project[]
  encryptedGitHubToken?: string
}

export const store = new Store<StoreSchema>({
  name: 'pluginpilot',
  defaults: {
    projects: []
  }
})
