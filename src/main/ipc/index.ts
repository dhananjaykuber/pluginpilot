import { registerAppHandlers } from './app'
import { registerAuthHandlers } from './auth'
import { registerProjectHandlers } from './projects'
import { registerRepositoryHandlers } from './repositories'

export function registerIpcHandlers(): void {
  registerAppHandlers()
  registerAuthHandlers()
  registerProjectHandlers()
  registerRepositoryHandlers()
}
