import type { PluginReleaseQuery, PluginVersion } from '@shared/types'
import { focusManager, QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

// TanStack Query refetches stale data when the page becomes visible, but switching apps
// doesn't hide an Electron window. Use window focus instead, e.g. after merging a PR on GitHub.
focusManager.setEventListener((setFocused) => {
  const handleFocus = (): void => setFocused(true)
  const handleBlur = (): void => setFocused(false)

  window.addEventListener('focus', handleFocus)
  window.addEventListener('blur', handleBlur)

  return () => {
    window.removeEventListener('focus', handleFocus)
    window.removeEventListener('blur', handleBlur)
  }
})

export const queryKeys = {
  appVersion: ['app', 'version'],
  githubUser: ['auth', 'user'],
  projects: ['projects'],
  repositories: ['repositories'],
  repositorySetup: (fullName: string, branch: string) => [
    'repositories',
    fullName,
    'setup',
    branch
  ],
  // Not under 'projects', so saving a project doesn't invalidate cached scans.
  projectPluginScans: (projectId: string) => ['plugin-scan', projectId],
  pluginScan: (projectId: string, branch: string) => ['plugin-scan', projectId, branch],
  pluginReleases: (plugins: PluginReleaseQuery[]) => [
    'plugin-releases',
    plugins.map(({ slug, packageName }) => `${slug}:${packageName ?? ''}`).sort()
  ],
  projectUpdatePullRequests: (projectId: string) => ['update-pull-requests', projectId],
  updatePullRequests: (projectId: string, branch: string) => [
    'update-pull-requests',
    projectId,
    branch
  ],
  settings: ['settings'],
  scanSummaries: ['scan-summaries'],
  vulnerabilities: ['vulnerabilities'],
  pluginVulnerabilities: (plugins: PluginVersion[]) => [
    'vulnerabilities',
    plugins.map(({ slug, version }) => `${slug}@${version}`).sort()
  ]
} as const
