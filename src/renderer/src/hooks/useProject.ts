import type { Project } from '@shared/types'
import { useProjects } from './useProjects'

type ProjectResult = {
  project: Project | undefined
  isPending: boolean
}

export function useProject(projectId: string): ProjectResult {
  const { data: projects, isPending } = useProjects()

  return {
    project: projects?.find((project) => project.id === projectId),
    isPending
  }
}
