import { dialog, type BrowserWindow } from 'electron'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import type { UploadedPluginZip } from '../../shared/types'
import { isNewerVersion } from '../../shared/versions'
import { extractPluginFiles, readPluginHeader, type PluginFile } from './pluginZip'

export type ExpectedPlugin = {
  name: string
  version: string
}

// Paths of zips the user chose, by ID. The renderer only ever sees the ID, so it can't make
// the main process read arbitrary files.
const uploadedZipPaths = new Map<string, string>()

// Asks the user for a zip and checks that it holds a newer version of the expected plugin.
// Returns null when the user cancels.
export async function chooseUploadedZip(
  window: BrowserWindow | null,
  expected: ExpectedPlugin
): Promise<UploadedPluginZip | null> {
  const options: Electron.OpenDialogOptions = {
    title: `Choose the ${expected.name} zip`,
    filters: [{ name: 'Zip archives', extensions: ['zip'] }],
    properties: ['openFile']
  }
  const { canceled, filePaths } = window
    ? await dialog.showOpenDialog(window, options)
    : await dialog.showOpenDialog(options)

  if (canceled || !filePaths[0]) {
    return null
  }

  const header = readPluginHeader(await readZipFiles(filePaths[0]))

  if (!header) {
    throw new Error('This zip does not contain a WordPress plugin.')
  }

  if (header.name.toLowerCase() !== expected.name.toLowerCase()) {
    throw new Error(`This zip contains "${header.name}", not "${expected.name}".`)
  }

  if (!header.version || !isNewerVersion(header.version, expected.version)) {
    throw new Error(
      `This zip has version ${header.version ?? 'unknown'}, which is not newer than ${expected.version}.`
    )
  }

  const zipId = randomUUID()
  uploadedZipPaths.set(zipId, filePaths[0])

  return { zipId, name: header.name, version: header.version }
}

export function readUploadedZip(zipId: string): Promise<PluginFile[]> {
  const path = uploadedZipPaths.get(zipId)

  if (!path) {
    throw new Error('The chosen zip is no longer available. Choose it again.')
  }

  return readZipFiles(path)
}

async function readZipFiles(path: string): Promise<PluginFile[]> {
  return extractPluginFiles(await readFile(path))
}
