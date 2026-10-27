import { registerAppHandlers } from './app'
import { registerAuthHandlers } from './auth'
import { registerProjectHandlers } from './projects'

export function registerIpcHandlers(): void {
  registerAppHandlers()
  registerAuthHandlers()
  registerProjectHandlers()
}
