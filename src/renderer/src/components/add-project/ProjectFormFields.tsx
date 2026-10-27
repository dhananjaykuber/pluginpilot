import type { RepositorySetup } from '@shared/types'
import type { useProjectForm } from '@/hooks/useProjectForm'
import type { ProjectFormErrors } from '@/lib/projectForm'
import { EnvironmentsCard } from './EnvironmentsCard'
import { PluginFoldersCard } from './PluginFoldersCard'
import { PullRequestLabelsCard } from './PullRequestLabelsCard'

type ProjectFormFieldsProps = {
  form: ReturnType<typeof useProjectForm>
  errors: ProjectFormErrors
  setup: RepositorySetup
}

// Plugin folders, environments and PR labels, shared by Add Project and project settings.
export function ProjectFormFields({
  form,
  errors,
  setup
}: ProjectFormFieldsProps): React.JSX.Element {
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
      <PullRequestLabelsCard labels={form.values.labels} onChange={form.updateLabels} />
    </>
  )
}
