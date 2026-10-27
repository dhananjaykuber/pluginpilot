export const paths = {
  projects: '/',
  newProject: '/projects/new',
  project: (projectId: string) => `/projects/${projectId}`,
  projectSettings: (projectId: string) => `/projects/${projectId}/settings`,
  settings: '/settings'
}
