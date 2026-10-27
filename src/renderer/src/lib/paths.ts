export const paths = {
  projects: '/',
  newProject: '/projects/new',
  project: (projectId: string) => `/projects/${projectId}`,
  projectEnvironment: (projectId: string, environmentName: string) =>
    `/projects/${projectId}?env=${encodeURIComponent(environmentName)}`,
  projectSettings: (projectId: string) => `/projects/${projectId}/settings`,
  settings: '/settings'
}
