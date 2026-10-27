import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query'
import type { ProjectScanSummaries, ScanSummary } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'
import type { UpdateTarget } from '@/lib/pluginUpdate'

export function useScanSummaries(): UseQueryResult<ProjectScanSummaries> {
  return useQuery({
    queryKey: queryKeys.scanSummaries,
    queryFn: () => window.api.projects.listScanSummaries()
  })
}

// Saves the latest scan result for the Projects page. `summary` is null until the update
// and vulnerability checks have finished, so half-finished counts are never saved.
export function useRecordScanSummary(target: UpdateTarget, summary: ScanSummary | null): void {
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: (scanSummary: ScanSummary) =>
      window.api.projects.saveScanSummary(target.projectId, target.environment.name, scanSummary),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.scanSummaries })
  })

  const { scannedAt, pluginCount, updateCount, vulnerableCount } = summary ?? {}

  useEffect(() => {
    if (scannedAt !== undefined) {
      mutate({
        scannedAt,
        pluginCount: pluginCount ?? 0,
        updateCount: updateCount ?? 0,
        vulnerableCount: vulnerableCount ?? null
      })
    }
  }, [mutate, scannedAt, pluginCount, updateCount, vulnerableCount])
}
