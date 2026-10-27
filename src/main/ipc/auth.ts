import { ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc'
import { connectGitHub, disconnectGitHub, getCurrentUser } from '../services/auth'
import {
  cancelGitHubSignIn,
  completeGitHubSignIn,
  startGitHubSignIn
} from '../services/githubSignIn'

export function registerAuthHandlers(): void {
  ipcMain.handle(IpcChannels.authGetUser, () => getCurrentUser())
  ipcMain.handle(IpcChannels.authStartSignIn, () => startGitHubSignIn())
  ipcMain.handle(IpcChannels.authCompleteSignIn, () => completeGitHubSignIn())
  ipcMain.handle(IpcChannels.authCancelSignIn, () => cancelGitHubSignIn())
  ipcMain.handle(IpcChannels.authConnect, (_event, token: string) => connectGitHub(token))
  ipcMain.handle(IpcChannels.authDisconnect, () => disconnectGitHub())
}
