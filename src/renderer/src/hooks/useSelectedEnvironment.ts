import { useSearchParams } from 'react-router'
import type { Environment, Project } from '@shared/types'
import { sortEnvironments } from '@/lib/environments'

const ENVIRONMENT_PARAM = 'env'

type SelectedEnvironment = {
  environment: Environment
  selectEnvironment: (name: string) => void
}

// Keeps the selected environment in the URL, falling back to the first one in display order
// (production when the project has it).
export function useSelectedEnvironment(project: Project): SelectedEnvironment {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedName = searchParams.get(ENVIRONMENT_PARAM)
  const environment =
    project.environments.find((candidate) => candidate.name === selectedName) ??
    sortEnvironments(project.environments)[0]

  return {
    environment,
    // Keeps other params, such as the selected tab.
    selectEnvironment: (name) =>
      setSearchParams(
        (params) => {
          params.set(ENVIRONMENT_PARAM, name)
          return params
        },
        { replace: true }
      )
  }
}
