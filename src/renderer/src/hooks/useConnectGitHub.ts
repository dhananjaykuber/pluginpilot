import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import type { GitHubUser } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

export function useConnectGitHub(): UseMutationResult<GitHubUser, Error, string> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) => window.api.auth.connect(token),
    onSuccess: (user) => queryClient.setQueryData(queryKeys.githubUser, user)
  })
}
