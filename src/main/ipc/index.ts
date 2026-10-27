import { registerAppHandlers } from './app'
import { registerAuthHandlers } from './auth'
import { registerPluginHandlers } from './plugins'
import { registerProjectHandlers } from './projects'
import { registerRepositoryHandlers } from './repositories'
import { registerSettingsHandlers } from './settings'
import { registerVulnerabilityHandlers } from './vulnerabilities'

export function registerIpcHandlers(): void {
  registerAppHandlers()
  registerAuthHandlers()
  registerPluginHandlers()
  registerProjectHandlers()
  registerRepositoryHandlers()
  registerSettingsHandlers()
  registerVulnerabilityHandlers()
}
