import { useEffect, useState } from 'react'
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import type { ScanAllProgress, ScanAllResult } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

type ScanAll = {
  scan: UseMutationResult<ScanAllResult, Error, void>
  // Set while any "Scan all" runs, including a background check.
  progress: ScanAllProgress | null
}

export function useScanAll(): ScanAll {
  const [progress, setProgress] = useState<ScanAllProgress | null>(null)

  useEffect(() => window.api.projects.onScanAllProgress(setProgress), [])
  useEffect(() => window.api.projects.onScanAllFinished(() => setProgress(null)), [])

  const scan = useMutation({ mutationFn: () => window.api.projects.scanAll() })

  return { scan, progress }
}

// Mounted once in the app layout: keeps the app in step with "Scan all", whether started from the
// button or a background check, and opens the page a clicked notification points to.
export function useScanAllSync(): void {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(
    () =>
      window.api.projects.onScanAllFinished((result) => {
        // Reuse the fresh scans, so opening a project afterwards doesn't scan it again.
        for (const { projectId, scan } of result.results) {
          if (scan) {
            queryClient.setQueryData(queryKeys.pluginScan(projectId, scan.branch), scan)
          }
        }
        queryClient.invalidateQueries({ queryKey: queryKeys.scanSummaries })
      }),
    [queryClient]
  )

  useEffect(() => window.api.app.onNavigate((path) => navigate(path)), [navigate])
}
