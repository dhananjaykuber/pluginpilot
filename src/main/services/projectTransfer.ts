import { dialog, type BrowserWindow } from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import type { ProjectExportResult, ProjectImportResult } from '../../shared/types'
import { parseProjectExport, serializeProjects } from './projectExportFormat'
import { addProject, listProjects } from './projects'

const JSON_FILTER = { name: 'PluginPilot projects', extensions: ['json'] }

// Returns null when the user cancels the save dialog.
export async function exportProjects(
  window: BrowserWindow | null
): Promise<ProjectExportResult | null> {
  const options: Electron.SaveDialogOptions = {
    title: 'Export projects',
    defaultPath: 'pluginpilot-projects.json',
    filters: [JSON_FILTER]
  }
  const { canceled, filePath } = window
    ? await dialog.showSaveDialog(window, options)
    : await dialog.showSaveDialog(options)

  if (canceled || !filePath) {
    return null
  }

  const projects = listProjects()
  await writeFile(filePath, serializeProjects(projects))

  return { count: projects.length, filePath }
}

// Adds every project from the file that isn't added yet. Returns null when the user cancels.
export async function importProjects(
  window: BrowserWindow | null
): Promise<ProjectImportResult | null> {
  const options: Electron.OpenDialogOptions = {
    title: 'Import projects',
    filters: [JSON_FILTER],
    properties: ['openFile']
  }
  const { canceled, filePaths } = window
    ? await dialog.showOpenDialog(window, options)
    : await dialog.showOpenDialog(options)

  if (canceled || !filePaths[0]) {
    return null
  }

  const incoming = parseProjectExport(await readFile(filePaths[0], 'utf8'))
  const knownRepos = new Set(listProjects().map(({ repo }) => toKey(repo)))
  const newProjects = incoming.filter(({ repo }) => {
    const key = toKey(repo)

    // Also skips a repository listed twice in the same file.
    if (knownRepos.has(key)) {
      return false
    }

    knownRepos.add(key)
    return true
  })

  newProjects.forEach(addProject)

  return { imported: newProjects.length, skipped: incoming.length - newProjects.length }
}

// GitHub owner and repository names are case-insensitive.
function toKey(repo: { owner: string; name: string }): string {
  return `${repo.owner}/${repo.name}`.toLowerCase()
}
