import { useState } from 'react'
import { createDraftId, type EnvironmentDraft, type ProjectFormValues } from '@/lib/projectForm'

type EnvironmentChanges = Partial<Omit<EnvironmentDraft, 'id'>>

type ProjectForm = {
  values: ProjectFormValues
  addPluginPath: () => void
  updatePluginPath: (id: string, path: string) => void
  removePluginPath: (id: string) => void
  addEnvironment: () => void
  updateEnvironment: (id: string, changes: EnvironmentChanges) => void
  removeEnvironment: (id: string) => void
}

export function useProjectForm(createInitialValues: () => ProjectFormValues): ProjectForm {
  const [values, setValues] = useState(createInitialValues)

  function setPluginPaths(
    update: (paths: ProjectFormValues['pluginPaths']) => ProjectFormValues['pluginPaths']
  ): void {
    setValues((current) => ({ ...current, pluginPaths: update(current.pluginPaths) }))
  }

  function setEnvironments(
    update: (rows: ProjectFormValues['environments']) => ProjectFormValues['environments']
  ): void {
    setValues((current) => ({ ...current, environments: update(current.environments) }))
  }

  return {
    values,
    addPluginPath: () => setPluginPaths((paths) => [...paths, { id: createDraftId(), path: '' }]),
    updatePluginPath: (id, path) =>
      setPluginPaths((paths) =>
        paths.map((draft) => (draft.id === id ? { ...draft, path } : draft))
      ),
    removePluginPath: (id) => setPluginPaths((paths) => paths.filter((draft) => draft.id !== id)),
    addEnvironment: () =>
      setEnvironments((rows) => [...rows, { id: createDraftId(), name: '', branch: '' }]),
    updateEnvironment: (id, changes) =>
      setEnvironments((rows) => rows.map((row) => (row.id === id ? { ...row, ...changes } : row))),
    removeEnvironment: (id) => setEnvironments((rows) => rows.filter((row) => row.id !== id))
  }
}
