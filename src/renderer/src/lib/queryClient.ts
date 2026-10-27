import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const queryKeys = {
  appVersion: ['app', 'version'],
  githubUser: ['auth', 'user'],
  projects: ['projects'],
  repositories: ['repositories']
} as const
