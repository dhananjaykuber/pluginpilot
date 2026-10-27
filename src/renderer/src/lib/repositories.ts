import type { Project, RepositorySummary } from '@shared/types'

function getProjectFullName(project: Project): string {
  return `${project.repo.owner}/${project.repo.name}`
}

// Repositories that aren't added as projects yet and match the search text.
export function filterAvailableRepositories(
  repositories: RepositorySummary[],
  projects: Project[],
  search: string
): RepositorySummary[] {
  const addedFullNames = new Set(projects.map(getProjectFullName))
  const query = search.trim().toLowerCase()

  return repositories.filter(
    (repository) =>
      !addedFullNames.has(repository.fullName) && repository.fullName.toLowerCase().includes(query)
  )
}
