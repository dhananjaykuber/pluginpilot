import type {
  LocalModificationsRequest,
  PluginFileChange,
  PluginModifications
} from '../../shared/types'
import { getAuthenticatedOctokit } from './github'
import { getGitBlobSha, listFolderFiles } from './githubTree'
import { extractPluginFiles } from './pluginZip'
import { getProject } from './projects'

// Enough to see what was changed without flooding the dialog.
const MAX_LISTED_CHANGES = 50

// Compares a committed plugin folder with the original WordPress.org zip of the same version,
// so updating doesn't silently overwrite hand-made changes.
export async function findLocalModifications(
  request: LocalModificationsRequest
): Promise<PluginModifications> {
  const project = getProject(request.projectId)
  const environment = project.environments.find((env) => env.name === request.environmentName)

  if (!environment) {
    throw new Error(`Environment ${request.environmentName} was not found.`)
  }

  const originalZip = await downloadOriginalZip(request.slug, request.version)

  if (!originalZip) {
    return { status: 'unknown', changes: [], totalChanges: 0 }
  }

  const original = new Map(
    extractPluginFiles(originalZip).map((file) => [file.path, getGitBlobSha(file.content)])
  )
  const committed = await listFolderFiles(
    getAuthenticatedOctokit(),
    { owner: project.repo.owner, repo: project.repo.name },
    environment.branch,
    request.path
  )
  const changes = compareFiles(original, stripFolder(committed, request.path))

  return {
    status: changes.length > 0 ? 'modified' : 'unmodified',
    changes: changes.slice(0, MAX_LISTED_CHANGES),
    totalChanges: changes.length
  }
}

// Both maps go from a path inside the plugin folder to its git blob SHA.
function compareFiles(
  original: Map<string, string>,
  committed: Map<string, string>
): PluginFileChange[] {
  const modified: PluginFileChange[] = [...committed]
    .filter(([path, sha]) => original.has(path) && original.get(path) !== sha)
    .map(([path]) => ({ path, kind: 'modified' }))
  const addedPaths = [...committed.keys()].filter((path) => !original.has(path))
  const removedPaths = [...original.keys()].filter((path) => !committed.has(path))

  // A file whose name only differs in letter case but has the same content isn't a hand-made
  // change. It happens when a plugin renames a file and a case-insensitive Mac keeps the old name.
  const sameFileKey = (path: string, sha: string | undefined): string =>
    `${path.toLowerCase()}:${sha}`
  const addedKeys = new Set(addedPaths.map((path) => sameFileKey(path, committed.get(path))))
  const removedKeys = new Set(removedPaths.map((path) => sameFileKey(path, original.get(path))))

  const added: PluginFileChange[] = addedPaths
    .filter((path) => !removedKeys.has(sameFileKey(path, committed.get(path))))
    .map((path) => ({ path, kind: 'added' }))
  const removed: PluginFileChange[] = removedPaths
    .filter((path) => !addedKeys.has(sameFileKey(path, original.get(path))))
    .map((path) => ({ path, kind: 'removed' }))

  return [...modified, ...added, ...removed]
}

// "plugins/safe-svg/safe-svg.php" → "safe-svg.php"
function stripFolder(files: Map<string, string>, folderPath: string): Map<string, string> {
  return new Map([...files].map(([path, sha]) => [path.slice(folderPath.length + 1), sha]))
}

// WordPress.org keeps a zip for each released version. Returns null when it doesn't exist.
async function downloadOriginalZip(slug: string, version: string): Promise<Buffer | null> {
  const response = await fetch(`https://downloads.wordpress.org/plugin/${slug}.${version}.zip`)

  if (!response.ok) {
    return null
  }

  return Buffer.from(await response.arrayBuffer())
}
