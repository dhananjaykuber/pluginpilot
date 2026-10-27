import type { GitHubUser } from '../../shared/types'
import { fetchGitHubUser, isUnauthorizedError } from './github'
import { clearGitHubToken, getGitHubToken, saveGitHubToken } from './githubToken'

export async function getCurrentUser(): Promise<GitHubUser | null> {
  const token = getGitHubToken()

  if (!token) {
    return null
  }

  try {
    return await fetchGitHubUser(token)
  } catch (error) {
    // A revoked or expired token can't be recovered, so sign the user out.
    if (isUnauthorizedError(error)) {
      clearGitHubToken()
      return null
    }

    throw error
  }
}

export async function connectGitHub(token: string): Promise<GitHubUser> {
  const trimmedToken = token.trim()

  try {
    const user = await fetchGitHubUser(trimmedToken)
    saveGitHubToken(trimmedToken)
    return user
  } catch (error) {
    if (isUnauthorizedError(error)) {
      throw new Error('GitHub rejected this token. Check that it is correct and not expired.', {
        cause: error
      })
    }

    throw error
  }
}

export function disconnectGitHub(): void {
  clearGitHubToken()
}
