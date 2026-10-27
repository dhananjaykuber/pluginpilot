import { Route, Routes } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { AddProjectPage } from '@/pages/AddProjectPage'
import { ProjectPage } from '@/pages/ProjectPage'
import { SettingsPage } from '@/pages/SettingsPage'

export function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ProjectsPage />} />
        <Route path="projects/new" element={<AddProjectPage />} />
        <Route path="projects/:projectId" element={<ProjectPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
