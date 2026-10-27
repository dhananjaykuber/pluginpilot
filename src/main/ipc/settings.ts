import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import { clearWordfenceKey, getSettings, setWordfenceKey } from '../services/settings'

export function registerSettingsHandlers(): void {
  ipcMain.handle(IpcChannels.settingsGet, () => getSettings())
  ipcMain.handle(IpcChannels.settingsSetWordfenceKey, (_event, apiKey: string) =>
    setWordfenceKey(apiKey)
  )
  ipcMain.handle(IpcChannels.settingsClearWordfenceKey, () => clearWordfenceKey())
}
