import type { Octokit } from '@octokit/rest'
import type { ComposerSetup, PluginFolder, RepositorySetup } from '../../shared/types'
import { getAuthenticatedOctokit } from './github'
import { listBranchNames, readDirectory, readTextFile, type RepositoryRef } from './githubContent'
import { countWpackagistPlugins, getPluginInstallerPath, parseComposerJson } from './composer'

const COMMON_PLUGIN_FOLDERS = [
  'plugins',
  'wp-content/plugins',
  'public/wp-content/plugins',
  'web/app/plugins',
  'wordpress/wp-content/plugins'
]

export async function detectRepositorySetup(
  owner: string,
  repo: string,
  branch: string
): Promise<RepositorySetup> {
  const octokit = getAuthenticatedOctokit()
  const location: RepositoryRef = { owner, repo, ref: branch }

  const [rootEntries, branches] = await Promise.all([
    readDirectory(octokit, location, ''),
    listBranchNames(octokit, owner, repo)
  ])
  const rootNames = new Set((rootEntries ?? []).map((entry) => entry.name))

  const composer = rootNames.has('composer.json')
    ? await detectComposer(octokit, location, rootNames.has('composer.lock'))
    : null
  const pluginFolders = await detectPluginFolders(
    octokit,
    location,
    rootNames,
    composer?.installerPath ?? null
  )

  return { branch, pluginFolders, composer, branches }
}

async function detectComposer(
  octokit: Octokit,
  location: RepositoryRef,
  hasLock: boolean
): Promise<ComposerSetup> {
  const contents = await readTextFile(octokit, location, 'composer.json')
  const composer = contents ? parseComposerJson(contents) : null

  if (!composer) {
    return { hasLock, isValid: false, pluginPackageCount: 0, installerPath: null }
  }

  return {
    hasLock,
    isValid: true,
    pluginPackageCount: countWpackagistPlugins(composer),
    installerPath: getPluginInstallerPath(composer)
  }
}

async function detectPluginFolders(
  octokit: Octokit,
  location: RepositoryRef,
  rootNames: Set<string>,
  installerPath: string | null
): Promise<PluginFolder[]> {
  const candidates = [...new Set([...COMMON_PLUGIN_FOLDERS, installerPath])].filter(
    (path): path is string => !!path && rootNames.has(path.split('/')[0])
  )

  const folders = await Promise.all(
    candidates.map(async (path) => {
      const entries = await readDirectory(octokit, location, path)
      return (
        entries && { path, pluginCount: entries.filter((entry) => entry.type === 'dir').length }
      )
    })
  )

  return folders.filter((folder): folder is PluginFolder => folder !== null)
}
