import { registerAppHandlers } from './app'
import { registerAuthHandlers } from './auth'
import { registerPluginHandlers } from './plugins'
import { registerProjectHandlers } from './projects'
import { registerRepositoryHandlers } from './repositories'

export function registerIpcHandlers(): void {
  registerAppHandlers()
  registerAuthHandlers()
  registerPluginHandlers()
  registerProjectHandlers()
  registerRepositoryHandlers()
}
