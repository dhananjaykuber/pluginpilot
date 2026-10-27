import { registerAppHandlers } from './app'
import { registerProjectHandlers } from './projects'

export function registerIpcHandlers(): void {
  registerAppHandlers()
  registerProjectHandlers()
}
