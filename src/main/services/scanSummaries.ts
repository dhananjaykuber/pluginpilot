import type { ProjectScanSummaries, ScanSummary } from '../../shared/types'
import { store } from '../store'

// The last scan result per project and environment, shown on the Projects page.
export function listScanSummaries(): ProjectScanSummaries {
  return store.get('scanSummaries')
}

export function saveScanSummary(
  projectId: string,
  environmentName: string,
  summary: ScanSummary
): void {
  const summaries = listScanSummaries()

  store.set('scanSummaries', {
    ...summaries,
    [projectId]: { ...summaries[projectId], [environmentName]: summary }
  })
}

export function deleteScanSummaries(projectId: string): void {
  const summaries = { ...listScanSummaries() }
  delete summaries[projectId]
  store.set('scanSummaries', summaries)
}
