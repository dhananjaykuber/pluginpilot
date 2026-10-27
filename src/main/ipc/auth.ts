import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import { connectGitHub, disconnectGitHub, getCurrentUser } from '../services/auth'

export function registerAuthHandlers(): void {
  ipcMain.handle(IpcChannels.authGetUser, () => getCurrentUser())
  ipcMain.handle(IpcChannels.authConnect, (_event, token: string) => connectGitHub(token))
  ipcMain.handle(IpcChannels.authDisconnect, () => disconnectGitHub())
}
