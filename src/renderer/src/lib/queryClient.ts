import type { PluginVersion } from '@shared/types'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

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
  pluginScan: (projectId: string, branch: string) => ['plugin-scan', projectId, branch],
  pluginReleases: (slugs: string[]) => ['plugin-releases', [...slugs].sort()],
  settings: ['settings'],
  vulnerabilities: ['vulnerabilities'],
  pluginVulnerabilities: (plugins: PluginVersion[]) => [
    'vulnerabilities',
    plugins.map(({ slug, version }) => `${slug}@${version}`).sort()
  ]
} as const
