import type { Environment, NewProject, Project } from '../../shared/types'

// Bump when the file format changes in a way older versions can't read.
const FORMAT_VERSION = 1
const MAX_PROJECTS = 500

const NAME_PATTERN = /^[\w.-]+$/

type ProjectExport = {
  version: number
  exportedAt: string
  projects: NewProject[]
}

// Only the project setup is exported. Tokens and keys never leave the keychain.
export function serializeProjects(projects: Project[]): string {
  const data: ProjectExport = {
    version: FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    projects: projects.map(({ repo, pluginPaths, environments, labels }) => ({
      repo,
      pluginPaths,
      environments,
      labels
    }))
  }

  return JSON.stringify(data, null, 2)
}

// Validates every project before returning any, so a bad file imports nothing.
export function parseProjectExport(contents: string): NewProject[] {
  let data: unknown

  try {
    data = JSON.parse(contents)
  } catch {
    throw new Error('This file is not valid JSON.')
  }

  if (!isRecord(data) || data.version !== FORMAT_VERSION || !Array.isArray(data.projects)) {
    throw new Error('This is not a PluginPilot projects file.')
  }

  if (data.projects.length > MAX_PROJECTS) {
    throw new Error(`This file has more than ${MAX_PROJECTS} projects.`)
  }

  return data.projects.map((project, index) => parseProject(project, index + 1))
}

function parseProject(value: unknown, position: number): NewProject {
  const fail = (reason: string): never => {
    throw new Error(`Project ${position} in the file is invalid: ${reason}`)
  }

  if (!isRecord(value) || !isRecord(value.repo)) {
    return fail('missing repository.')
  }

  const { owner, name } = value.repo

  if (!isName(owner) || !isName(name)) {
    return fail('repository must be "owner/name".')
  }

  if (!Array.isArray(value.pluginPaths) || !value.pluginPaths.every(isRelativePath)) {
    return fail('plugin folders must be relative paths inside the repository.')
  }

  if (!Array.isArray(value.environments) || value.environments.length === 0) {
    return fail('at least one environment is needed.')
  }

  const environments = value.environments.map((environment): Environment => {
    if (!isRecord(environment) || !isFilled(environment.name) || !isFilled(environment.branch)) {
      return fail('every environment needs a name and a branch.')
    }

    return { name: environment.name.trim(), branch: environment.branch.trim() }
  })

  const names = environments.map((environment) => environment.name.toLowerCase())

  if (new Set(names).size !== names.length) {
    return fail('environment names must be unique.')
  }

  // Optional, so files exported before labels existed still import.
  const labels = value.labels ?? []

  if (!Array.isArray(labels) || !labels.every(isFilled)) {
    return fail('labels must be a list of names.')
  }

  return { repo: { owner, name }, pluginPaths: value.pluginPaths, environments, labels }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isName(value: unknown): value is string {
  return typeof value === 'string' && NAME_PATTERN.test(value)
}

function isFilled(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

// "plugins" or "wp-content/plugins", but not "/etc", "../x" or "".
function isRelativePath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    !value.startsWith('/') &&
    !value.split('/').some((segment) => segment === '..' || segment === '')
  )
}
