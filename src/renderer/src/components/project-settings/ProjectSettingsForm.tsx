import { TriangleAlertIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { Project, RepositorySetup } from '@shared/types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { FormActions } from '@/components/common/FormActions'
import { ProjectFormFields } from '@/components/add-project/ProjectFormFields'
import { useProjectForm } from '@/hooks/useProjectForm'
import { useUpdateProject } from '@/hooks/useProjectMutations'
import { useProjectSetup } from '@/hooks/useProjectSetup'
import { getErrorMessage } from '@/lib/errors'
import { paths } from '@/lib/paths'
import {
  hasProjectFormErrors,
  projectToFormValues,
  toProjectChanges,
  validateProjectForm
} from '@/lib/projectForm'

type ProjectSettingsFormProps = {
  project: Project
}

// Waits for the repository's branches, which the environment selects need.
export function ProjectSettingsForm({ project }: ProjectSettingsFormProps): React.JSX.Element {
  const setup = useProjectSetup(project)

  if (setup.isPending) {
    return <Skeleton className="h-64 w-full" />
  }

  if (setup.isError) {
    return (
      <EmptyState
        icon={TriangleAlertIcon}
        title="Couldn't load the repository"
        description={getErrorMessage(setup.error)}
        action={
          <Button variant="outline" onClick={() => setup.refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  return <EditProjectForm project={project} setup={setup.data} />
}

type EditProjectFormProps = ProjectSettingsFormProps & {
  setup: RepositorySetup
}

function EditProjectForm({ project, setup }: EditProjectFormProps): React.JSX.Element {
  const updateProject = useUpdateProject()
  const form = useProjectForm(() => projectToFormValues(project))
  const errors = validateProjectForm(form.values, setup)
  const changes = toProjectChanges(form.values)
  const hasChanges =
    JSON.stringify(changes) !==
    JSON.stringify({
      pluginPaths: project.pluginPaths,
      environments: project.environments,
      labels: project.labels ?? []
    })

  function handleSave(): void {
    updateProject.mutate(
      { projectId: project.id, changes },
      { onSuccess: () => toast.success('Project settings saved') }
    )
  }

  return (
    <>
      <ProjectFormFields form={form} errors={errors} setup={setup} />
      <FormActions
        saveLabel="Save changes"
        cancelTo={paths.project(project.id)}
        disabled={!hasChanges || hasProjectFormErrors(errors)}
        isSaving={updateProject.isPending}
        error={updateProject.isError ? getErrorMessage(updateProject.error) : null}
        onSave={handleSave}
      />
    </>
  )
}
