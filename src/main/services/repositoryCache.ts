import type { RepositorySummary } from '../../shared/types'
import { store } from '../store'

// The last repository list, shown instantly while a fresh one loads. Cleared whenever the GitHub
// token changes, so another account's repositories are never shown.
export function getCachedRepositories(): RepositorySummary[] | null {
  return store.get('cachedRepositories') ?? null
}

export function saveCachedRepositories(repositories: RepositorySummary[]): void {
  store.set('cachedRepositories', repositories)
}

export function clearCachedRepositories(): void {
  store.delete('cachedRepositories')
}
