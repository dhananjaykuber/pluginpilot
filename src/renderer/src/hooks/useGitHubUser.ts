import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { GitHubUser } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

export function useGitHubUser(): UseQueryResult<GitHubUser | null> {
  return useQuery({
    queryKey: queryKeys.githubUser,
    queryFn: () => window.api.auth.getUser(),
    staleTime: Infinity
  })
}
