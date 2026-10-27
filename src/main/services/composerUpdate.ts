import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  getConstraintForVersion,
  getLockedVersion,
  isDevRequirement,
  parseComposerJson
} from './composer'
import { runComposer } from './composerCli'
import { findNewestVersion, getReleasedVersions } from './composerVersions'

export type ComposerFiles = {
  composerJson: string
  composerLock: string
}

type PackageUpdate = ComposerFiles & {
  packageName: string
  version: string
}

// Updates one package in composer.lock without installing anything. If the current
// constraint in composer.json doesn't allow the version, the constraint is raised too.
export async function updateComposerPackage(update: PackageUpdate): Promise<ComposerFiles> {
  const { packageName, version } = update
  const composer = parseComposerJson(update.composerJson)

  if (!composer) {
    throw new Error('composer.json is not valid JSON.')
  }

  const workDir = await mkdtemp(join(tmpdir(), 'pluginpilot-composer-'))

  try {
    await writeComposerFiles(workDir, update)
    await runComposer(['update', packageName, '--no-install'], workDir)

    if (getLockedVersion(await readLock(workDir), packageName) !== version) {
      await assertVersionAvailable(packageName, version, workDir)

      const constraint = getConstraintForVersion(composer, packageName, version)
      const devFlag = isDevRequirement(composer, packageName) ? ['--dev'] : []
      await runComposer(
        ['require', `${packageName}:${constraint}`, '--no-install', ...devFlag],
        workDir
      )
    }

    const files = await readComposerFiles(workDir)
    const lockedVersion = getLockedVersion(files.composerLock, packageName)

    if (lockedVersion !== version) {
      throw new Error(
        `Composer resolved ${packageName} to ${lockedVersion ?? 'nothing'} instead of ${version}.`
      )
    }

    return files
  } finally {
    await rm(workDir, { recursive: true, force: true })
  }
}

// Checks the project's Composer repositories before raising the constraint, so a version
// that isn't there yet (e.g. a private mirror that lags behind WordPress.org) gets a clear
// message instead of Composer's dependency resolution output.
async function assertVersionAvailable(
  packageName: string,
  version: string,
  workDir: string
): Promise<void> {
  const output = await runComposer(['show', packageName, '--all', '--format=json'], workDir)
  const versions = getReleasedVersions(output)

  if (versions.includes(version)) {
    return
  }

  const newest = findNewestVersion(versions)
  const newestText = newest ? ` The newest version there is ${newest}.` : ''

  throw new Error(
    `${packageName} ${version} isn't available in this project's Composer repositories yet.${newestText}`
  )
}

async function writeComposerFiles(dir: string, files: ComposerFiles): Promise<void> {
  await writeFile(join(dir, 'composer.json'), files.composerJson)
  await writeFile(join(dir, 'composer.lock'), files.composerLock)
}

async function readComposerFiles(dir: string): Promise<ComposerFiles> {
  return {
    composerJson: await readFile(join(dir, 'composer.json'), 'utf8'),
    composerLock: await readLock(dir)
  }
}

function readLock(dir: string): Promise<string> {
  return readFile(join(dir, 'composer.lock'), 'utf8')
}
