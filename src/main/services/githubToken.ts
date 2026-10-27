import { safeStorage } from 'electron'
import { store } from '../store'

export function saveGitHubToken(token: string): void {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Secure storage is not available on this system.')
  }

  const encrypted = safeStorage.encryptString(token).toString('base64')
  store.set('encryptedGitHubToken', encrypted)
}

export function getGitHubToken(): string | null {
  const encrypted = store.get('encryptedGitHubToken')

  if (!encrypted) {
    return null
  }

  return safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
}

export function clearGitHubToken(): void {
  store.delete('encryptedGitHubToken')
}
