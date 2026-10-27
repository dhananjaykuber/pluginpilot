import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { UpdatePullRequest } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'
import type { UpdateTarget } from '@/lib/pluginUpdate'

export function useUpdatePullRequests(target: UpdateTarget): UseQueryResult<UpdatePullRequest[]> {
  const { projectId, environment } = target

  return useQuery({
    queryKey: queryKeys.updatePullRequests(projectId, environment.branch),
    queryFn: () => window.api.plugins.listUpdatePullRequests(projectId, environment.branch),
    // Refetch when returning to the app, e.g. after merging a pull request on GitHub.
    staleTime: 60_000
  })
}
