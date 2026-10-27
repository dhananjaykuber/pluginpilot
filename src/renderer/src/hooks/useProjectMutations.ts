import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import type { Project, ProjectChanges } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

type ProjectUpdate = {
  projectId: string
  changes: ProjectChanges
}

// Plugin folders or environment branches may have changed, so scans and pull requests are refetched.
export function useUpdateProject(): UseMutationResult<Project, Error, ProjectUpdate> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, changes }: ProjectUpdate) =>
      window.api.projects.update(projectId, changes),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
      queryClient.invalidateQueries({ queryKey: queryKeys.projectPluginScans(project.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.projectUpdatePullRequests(project.id) })
    }
  })
}

export function useDeleteProject(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) => window.api.projects.delete(projectId),
    onSuccess: (_result, projectId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
      queryClient.removeQueries({ queryKey: queryKeys.projectPluginScans(projectId) })
      queryClient.removeQueries({ queryKey: queryKeys.projectUpdatePullRequests(projectId) })
    }
  })
}
