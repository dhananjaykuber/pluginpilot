import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import type { RepositorySetup, RepositorySummary } from '@shared/types'
import { useAddProject } from '@/hooks/useAddProject'
import { useProjectForm } from '@/hooks/useProjectForm'
import { useRepositorySetup } from '@/hooks/useRepositorySetup'
import { getErrorMessage } from '@/lib/errors'
import { paths } from '@/lib/paths'
import {
  createInitialProjectForm,
  hasProjectFormErrors,
  toNewProject,
  validateProjectForm
} from '@/lib/projectForm'
import { FormActions } from '@/components/common/FormActions'
import { ProjectFormFields } from './ProjectFormFields'

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
  const navigate = useNavigate()
  const addProject = useAddProject()
  const form = useProjectForm(() => createInitialProjectForm(setup, repository.defaultBranch))
  const errors = validateProjectForm(form.values, setup)

  function handleSave(): void {
    addProject.mutate(toNewProject(form.values, repository), {
      onSuccess: (project) => {
        toast.success(`${repository.fullName} added`)
        navigate(paths.project(project.id))
      }
    })
  }

  return (
    <>
      <ProjectFormFields form={form} errors={errors} setup={setup} />
      <FormActions
        saveLabel="Add Project"
        cancelTo={paths.projects}
        disabled={hasProjectFormErrors(errors)}
        isSaving={addProject.isPending}
        error={addProject.isError ? getErrorMessage(addProject.error) : null}
        onSave={handleSave}
      />
    </>
  )
}
