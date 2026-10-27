import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Project } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

export function useProjects(): UseQueryResult<Project[]> {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => window.api.projects.list()
  })
}
