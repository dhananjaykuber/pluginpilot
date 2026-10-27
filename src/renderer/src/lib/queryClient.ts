import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const queryKeys = {
  appVersion: ['app', 'version'],
  projects: ['projects']
} as const
