import { clearCachedRepositories } from './repositoryCache'
import { clearSecret, getSecret, saveSecret } from './secrets'

export function saveGitHubToken(token: string): void {
  saveSecret('encryptedGitHubToken', token)
  clearCachedRepositories()
}

export function getGitHubToken(): string | null {
  return getSecret('encryptedGitHubToken')
}

export function clearGitHubToken(): void {
  clearSecret('encryptedGitHubToken')
  clearCachedRepositories()
}
