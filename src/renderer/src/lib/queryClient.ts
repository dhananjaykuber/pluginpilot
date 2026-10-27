import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const queryKeys = {
  appVersion: ['app', 'version'],
  githubUser: ['auth', 'user'],
  projects: ['projects'],
  repositories: ['repositories'],
  repositorySetup: (fullName: string, branch: string) => ['repositories', fullName, 'setup', branch]
} as const
