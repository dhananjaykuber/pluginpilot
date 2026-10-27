import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import type { NewProject, Project } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

export function useAddProject(): UseMutationResult<Project, Error, NewProject> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (project: NewProject) => window.api.projects.add(project),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects })
  })
}
