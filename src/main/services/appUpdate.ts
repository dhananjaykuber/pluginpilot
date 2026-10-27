import { writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { app, shell } from 'electron'
import type { AppUpdate } from '../../shared/types'
import { isNewerVersion } from '../../shared/versions'
import { getAuthenticatedOctokit, isNotFoundError } from './github'

// Releases are published here with `npm run release:mac`. The repository is private, so the
// signed-in user's token is used to read them.
const RELEASES_REPOSITORY = { owner: 'dhananjaykuber', repo: 'pluginpilot' }

const INSTALLER_EXTENSIONS: Partial<Record<NodeJS.Platform, string>> = {
  darwin: '.dmg',
  win32: '.exe',
  linux: '.AppImage'
}

// Resolves to null when this is the newest version, or when the user can't see the releases.
export async function checkForAppUpdate(): Promise<AppUpdate | null> {
  const octokit = getAuthenticatedOctokit()

  try {
    const { data: release } = await octokit.rest.repos.getLatestRelease(RELEASES_REPOSITORY)
    const version = release.tag_name.replace(/^v/, '')
    const extension = INSTALLER_EXTENSIONS[process.platform]
    const installer = release.assets.find((asset) => extension && asset.name.endsWith(extension))

    if (!installer || !isNewerVersion(version, app.getVersion())) {
      return null
    }

    return {
      version,
      releaseUrl: release.html_url,
      installerId: installer.id,
      installerName: installer.name
    }
  } catch (error) {
    // No releases yet, or the user has no access to the repository.
    if (isNotFoundError(error)) {
      return null
    }

    throw error
  }
}

// Saves the installer to Downloads and opens it, so the user only has to drag the app across.
export async function downloadAppUpdate(update: AppUpdate): Promise<void> {
  const { data } = await getAuthenticatedOctokit().rest.repos.getReleaseAsset({
    ...RELEASES_REPOSITORY,
    asset_id: update.installerId,
    headers: { accept: 'application/octet-stream' }
  })
  const filePath = join(app.getPath('downloads'), basename(update.installerName))

  await writeFile(filePath, Buffer.from(data as unknown as ArrayBuffer))

  const openError = await shell.openPath(filePath)

  if (openError) {
    throw new Error(`Downloaded to ${filePath}, but it couldn't be opened: ${openError}`)
  }
}
