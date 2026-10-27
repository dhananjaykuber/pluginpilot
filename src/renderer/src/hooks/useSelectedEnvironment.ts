import { useSearchParams } from 'react-router'
import type { Environment, Project } from '@shared/types'

const ENVIRONMENT_PARAM = 'env'

type SelectedEnvironment = {
  environment: Environment
  selectEnvironment: (name: string) => void
}

// Keeps the selected environment in the URL, falling back to the project's first environment.
export function useSelectedEnvironment(project: Project): SelectedEnvironment {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedName = searchParams.get(ENVIRONMENT_PARAM)
  const environment =
    project.environments.find((candidate) => candidate.name === selectedName) ??
    project.environments[0]

  return {
    environment,
    selectEnvironment: (name) => setSearchParams({ [ENVIRONMENT_PARAM]: name }, { replace: true })
  }
}
