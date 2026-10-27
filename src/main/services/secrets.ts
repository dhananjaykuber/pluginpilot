import { safeStorage } from 'electron'
import { store } from '../store'

type SecretName = 'encryptedGitHubToken' | 'encryptedWordfenceKey'

// Secrets are encrypted with the OS keychain and only the encrypted value is stored.
export function saveSecret(name: SecretName, value: string): void {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Secure storage is not available on this system.')
  }

  store.set(name, safeStorage.encryptString(value).toString('base64'))
}

export function getSecret(name: SecretName): string | null {
  const encrypted = store.get(name)

  if (!encrypted) {
    return null
  }

  return safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
}

export function clearSecret(name: SecretName): void {
  store.delete(name)
}
