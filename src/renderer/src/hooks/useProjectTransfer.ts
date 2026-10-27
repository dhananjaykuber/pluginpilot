import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import type { ProjectExportResult, ProjectImportResult } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

// Both resolve to null when the user cancels the file dialog.
export function useExportProjects(): UseMutationResult<ProjectExportResult | null, Error, void> {
  return useMutation({
    mutationFn: () => window.api.projects.exportAll()
  })
}

export function useImportProjects(): UseMutationResult<ProjectImportResult | null, Error, void> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => window.api.projects.importAll(),
    onSuccess: (result) => {
      if (result?.imported) {
        queryClient.invalidateQueries({ queryKey: queryKeys.projects })
      }
    }
  })
}
