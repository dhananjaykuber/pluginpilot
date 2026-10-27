import { ElectronAPI } from '@electron-toolkit/preload'
import type { PluginPilotApi } from '../shared/ipc'

declare global {
  interface Window {
    electron: ElectronAPI
    api: PluginPilotApi
  }
}
