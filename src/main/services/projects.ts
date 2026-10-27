import { randomUUID } from 'node:crypto'
import type { NewProject, Project, ProjectChanges } from '../../shared/types'
import { store } from '../store'
import { deleteScanSummaries } from './scanSummaries'

export function listProjects(): Project[] {
  return store.get('projects')
}

export function getProject(projectId: string): Project {
  const project = listProjects().find((candidate) => candidate.id === projectId)

  if (!project) {
    throw new Error('Project not found.')
  }

  return project
}

export function addProject(input: NewProject): Project {
  const projects = listProjects()
  const isDuplicate = projects.some(
    (project) => project.repo.owner === input.repo.owner && project.repo.name === input.repo.name
  )

  if (isDuplicate) {
    throw new Error(`${input.repo.owner}/${input.repo.name} is already added as a project.`)
  }

  const project: Project = { ...input, id: randomUUID(), createdAt: new Date().toISOString() }
  store.set('projects', [...projects, project])

  return project
}

export function updateProject(projectId: string, changes: ProjectChanges): Project {
  const updated: Project = { ...getProject(projectId), ...changes }

  store.set(
    'projects',
    listProjects().map((project) => (project.id === projectId ? updated : project))
  )

  return updated
}

// Only removes the project from PluginPilot; nothing changes on GitHub.
export function deleteProject(projectId: string): void {
  store.set(
    'projects',
    listProjects().filter((project) => project.id !== projectId)
  )
  deleteScanSummaries(projectId)
}
