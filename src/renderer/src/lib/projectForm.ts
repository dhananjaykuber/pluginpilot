import type { RepositorySetup } from '@shared/types'

export type EnvironmentDraft = {
  id: string
  name: string
  branch: string
}

export type PluginPathDraft = {
  id: string
  path: string
}

export type ProjectFormValues = {
  pluginPaths: PluginPathDraft[]
  environments: EnvironmentDraft[]
}

export type ProjectFormErrors = {
  pluginPaths: string | null
  environments: string | null
  environmentRows: Record<string, string>
}

// Common branch names for each environment, in order of preference.
const ENVIRONMENT_BRANCH_HINTS = [
  { name: 'Development', branches: ['develop', 'development', 'dev'] },
  { name: 'Staging', branches: ['staging', 'preprod', 'stage', 'uat'] },
  { name: 'Production', branches: ['production', 'main', 'master', 'prod'] }
]

export function createDraftId(): string {
  return crypto.randomUUID()
}

export function createInitialProjectForm(
  setup: RepositorySetup,
  defaultBranch: string
): ProjectFormValues {
  const detectedPaths = setup.pluginFolders.map((folder) => folder.path)

  return {
    pluginPaths: detectedPaths.map((path) => ({ id: createDraftId(), path })),
    environments: suggestEnvironments(setup.branches, defaultBranch)
  }
}

function suggestEnvironments(branches: string[], defaultBranch: string): EnvironmentDraft[] {
  const branchSet = new Set(branches)
  const suggestions = ENVIRONMENT_BRANCH_HINTS.flatMap(({ name, branches: hints }) => {
    const branch = hints.find((hint) => branchSet.has(hint))
    return branch ? [{ id: createDraftId(), name, branch }] : []
  })

  if (suggestions.length > 0) {
    return suggestions
  }

  return [{ id: createDraftId(), name: 'Production', branch: defaultBranch }]
}

export function validateProjectForm(
  values: ProjectFormValues,
  setup: RepositorySetup
): ProjectFormErrors {
  return {
    pluginPaths: validatePluginPaths(values.pluginPaths, setup),
    environments: values.environments.length === 0 ? 'Add at least one environment.' : null,
    environmentRows: validateEnvironmentRows(values.environments, setup.branches)
  }
}

function validatePluginPaths(paths: PluginPathDraft[], setup: RepositorySetup): string | null {
  const filledPaths = paths.map((draft) => normalizePath(draft.path)).filter(Boolean)

  if (filledPaths.length === 0 && !setup.composer) {
    return 'Add at least one plugin folder.'
  }

  if (new Set(filledPaths).size !== filledPaths.length) {
    return 'Each plugin folder can only be added once.'
  }

  return null
}

function validateEnvironmentRows(
  environments: EnvironmentDraft[],
  branches: string[]
): Record<string, string> {
  const errors: Record<string, string> = {}
  const seenNames = new Set<string>()
  const branchSet = new Set(branches)

  for (const environment of environments) {
    const name = environment.name.trim().toLowerCase()

    if (!name) {
      errors[environment.id] = 'Enter an environment name.'
    } else if (seenNames.has(name)) {
      errors[environment.id] = 'Environment names must be unique.'
    } else if (!branchSet.has(environment.branch)) {
      errors[environment.id] = 'Choose a branch.'
    }

    seenNames.add(name)
  }

  return errors
}

// "/wp-content/plugins/" → "wp-content/plugins"
function normalizePath(path: string): string {
  return path.trim().replace(/^\/+|\/+$/g, '')
}
