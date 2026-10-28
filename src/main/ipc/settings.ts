import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import {
  clearWordfenceKey,
  getSettings,
  setBackgroundChecks,
  setWordfenceKey
} from '../services/settings'

export function registerSettingsHandlers(): void {
  ipcMain.handle(IpcChannels.settingsGet, () => getSettings())
  ipcMain.handle(IpcChannels.settingsSetWordfenceKey, (_event, apiKey: string) =>
    setWordfenceKey(apiKey)
  )
  ipcMain.handle(IpcChannels.settingsClearWordfenceKey, () => clearWordfenceKey())
  ipcMain.handle(IpcChannels.settingsSetBackgroundChecks, (_event, enabled: boolean) =>
    setBackgroundChecks(enabled)
  )
}
