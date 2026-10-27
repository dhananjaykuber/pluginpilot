import { Octokit } from '@octokit/rest'
import type { GitHubUser } from '../../shared/types'
import { getGitHubToken } from './githubToken'

export function getAuthenticatedOctokit(): Octokit {
  const token = getGitHubToken()

  if (!token) {
    throw new Error('You are not signed in to GitHub.')
  }

  return new Octokit({ auth: token })
}

export async function fetchGitHubUser(token: string): Promise<GitHubUser> {
  const { data } = await new Octokit({ auth: token }).rest.users.getAuthenticated()

  return {
    login: data.login,
    name: data.name ?? data.login,
    avatarUrl: data.avatar_url
  }
}

export function isUnauthorizedError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && error.status === 401
}
