import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'

export function useDisconnectGitHub(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => window.api.auth.disconnect(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.githubUser, null)
      // The next account must not see this account's repositories.
      queryClient.removeQueries({ queryKey: queryKeys.repositories })
    }
  })
}
