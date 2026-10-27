import type { RepositorySetup, RepositorySummary } from '@shared/types'
import { useProjectForm } from '@/hooks/useProjectForm'
import { useRepositorySetup } from '@/hooks/useRepositorySetup'
import { createInitialProjectForm, validateProjectForm } from '@/lib/projectForm'
import { EnvironmentsCard } from './EnvironmentsCard'
import { PluginFoldersCard } from './PluginFoldersCard'

type ProjectConfigurationProps = {
  repository: RepositorySummary
}

// Shown once setup detection has finished, so the form can be prefilled.
export function ProjectConfiguration({
  repository
}: ProjectConfigurationProps): React.JSX.Element | null {
  const { data: setup } = useRepositorySetup(repository)

  if (!setup) {
    return null
  }

  return <ProjectConfigurationForm repository={repository} setup={setup} />
}

type ProjectConfigurationFormProps = ProjectConfigurationProps & {
  setup: RepositorySetup
}

function ProjectConfigurationForm({
  repository,
  setup
}: ProjectConfigurationFormProps): React.JSX.Element {
  const form = useProjectForm(() => createInitialProjectForm(setup, repository.defaultBranch))
  const errors = validateProjectForm(form.values, setup)

  return (
    <>
      <PluginFoldersCard
        paths={form.values.pluginPaths}
        error={errors.pluginPaths}
        usesComposer={setup.composer !== null}
        onAdd={form.addPluginPath}
        onChange={form.updatePluginPath}
        onRemove={form.removePluginPath}
      />
      <EnvironmentsCard
        environments={form.values.environments}
        branches={setup.branches}
        error={errors.environments}
        rowErrors={errors.environmentRows}
        onAdd={form.addEnvironment}
        onChange={form.updateEnvironment}
        onRemove={form.removeEnvironment}
      />
    </>
  )
}
