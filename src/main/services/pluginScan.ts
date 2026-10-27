import type { Octokit } from '@octokit/rest'
import type { InstalledPlugin, PluginScan } from '../../shared/types'
import { getLockedPlugins, getPluginInstallerPath, parseComposerJson } from './composer'
import { mapWithConcurrency } from './concurrency'
import { getAuthenticatedOctokit, isNotFoundError } from './github'
import { readDirectory, readTextFile, type RepositoryRef } from './githubContent'
import { parsePluginHeader, type PluginHeader } from './pluginHeader'
import { getProject } from './projects'

// composer/installers puts WordPress plugins here unless installer-paths says otherwise.
const DEFAULT_COMPOSER_PLUGIN_PATH = 'wp-content/plugins'
const SCAN_CONCURRENCY = 8

export async function scanProjectPlugins(projectId: string, branch: string): Promise<PluginScan> {
  const project = getProject(projectId)
  const octokit = getAuthenticatedOctokit()
  const location: RepositoryRef = {
    owner: project.repo.owner,
    repo: project.repo.name,
    ref: branch
  }

  await assertBranchExists(octokit, location)

  const composerPlugins = await scanComposerPlugins(octokit, location)
  const composerSlugs = new Set(composerPlugins.map((plugin) => plugin.slug))
  const folderPlugins = await Promise.all(
    project.pluginPaths.map((path) => scanPluginFolder(octokit, location, path, composerSlugs))
  )

  return {
    branch,
    scannedAt: new Date().toISOString(),
    plugins: [...composerPlugins, ...folderPlugins.flat()].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }
}

async function assertBranchExists(octokit: Octokit, location: RepositoryRef): Promise<void> {
  try {
    await octokit.rest.repos.getBranch({ ...location, branch: location.ref })
  } catch (error) {
    if (isNotFoundError(error)) {
      throw new Error(
        `Branch "${location.ref}" was not found in ${location.owner}/${location.repo}.`,
        {
          cause: error
        }
      )
    }

    throw error
  }
}

async function scanComposerPlugins(
  octokit: Octokit,
  location: RepositoryRef
): Promise<InstalledPlugin[]> {
  const [lockContents, composerContents] = await Promise.all([
    readTextFile(octokit, location, 'composer.lock'),
    readTextFile(octokit, location, 'composer.json')
  ])

  if (!lockContents) {
    return []
  }

  const composer = composerContents ? parseComposerJson(composerContents) : null
  const installPath = (composer && getPluginInstallerPath(composer)) ?? DEFAULT_COMPOSER_PLUGIN_PATH

  return getLockedPlugins(lockContents).map((plugin) => ({
    slug: plugin.slug,
    name: plugin.slug,
    version: plugin.version,
    source: 'composer',
    path: `${installPath}/${plugin.slug}`
  }))
}

// Plugins committed to the repository. Folders installed by Composer are skipped,
// so a plugin is never listed twice.
async function scanPluginFolder(
  octokit: Octokit,
  location: RepositoryRef,
  folderPath: string,
  composerSlugs: Set<string>
): Promise<InstalledPlugin[]> {
  const entries = await readDirectory(octokit, location, folderPath)
  const slugs = (entries ?? [])
    .filter((entry) => entry.type === 'dir' && !composerSlugs.has(entry.name))
    .map((entry) => entry.name)

  const plugins = await mapWithConcurrency(slugs, SCAN_CONCURRENCY, (slug) =>
    readFolderPlugin(octokit, location, `${folderPath}/${slug}`, slug)
  )

  return plugins.filter((plugin): plugin is InstalledPlugin => plugin !== null)
}

// Finds the plugin's main file the way WordPress does: the top-level PHP file with a
// "Plugin Name" header. `<slug>.php` is checked first because it's the usual convention.
async function readFolderPlugin(
  octokit: Octokit,
  location: RepositoryRef,
  pluginPath: string,
  slug: string
): Promise<InstalledPlugin | null> {
  const conventionalFile = `${pluginPath}/${slug}.php`
  const header =
    (await readPluginHeader(octokit, location, conventionalFile)) ??
    (await findPluginHeader(octokit, location, pluginPath, conventionalFile))

  if (!header) {
    return null
  }

  return { slug, name: header.name, version: header.version, source: 'manual', path: pluginPath }
}

async function readPluginHeader(
  octokit: Octokit,
  location: RepositoryRef,
  filePath: string
): Promise<PluginHeader | null> {
  const contents = await readTextFile(octokit, location, filePath)
  return contents ? parsePluginHeader(contents) : null
}

async function findPluginHeader(
  octokit: Octokit,
  location: RepositoryRef,
  pluginPath: string,
  skipFile: string
): Promise<PluginHeader | null> {
  const entries = await readDirectory(octokit, location, pluginPath)
  const phpFiles = (entries ?? []).filter(
    (entry) => entry.type === 'file' && entry.name.endsWith('.php') && entry.path !== skipFile
  )

  for (const file of phpFiles) {
    const header = await readPluginHeader(octokit, location, file.path)

    if (header) {
      return header
    }
  }

  return null
}
