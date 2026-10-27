import { execFile } from 'node:child_process'
import { homedir } from 'node:os'
import { delimiter, join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const COMMAND_TIMEOUT_MS = 5 * 60 * 1000

// Apps opened from the Dock get a minimal PATH, so add the usual Composer and PHP locations.
const EXTRA_PATHS = [
  '/opt/homebrew/bin',
  '/usr/local/bin',
  join(homedir(), '.composer', 'vendor', 'bin'),
  join(homedir(), '.config', 'composer', 'vendor', 'bin')
]

// Flags for every run: never prompt, never run project scripts or plugins, and don't let the
// local PHP version block resolving versions for the project's server.
// Enough of Composer's output to include the reason, e.g. "Problem 1 …".
const ERROR_LINES = 8

const SAFE_FLAGS = ['--no-interaction', '--no-scripts', '--no-plugins', '--ignore-platform-reqs']

// Resolves to Composer's standard output.
export async function runComposer(args: string[], cwd: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync('composer', [...args, ...SAFE_FLAGS], {
      cwd,
      timeout: COMMAND_TIMEOUT_MS,
      maxBuffer: 10 * 1024 * 1024,
      env: { ...process.env, PATH: [process.env.PATH, ...EXTRA_PATHS].join(delimiter) }
    })

    return stdout
  } catch (error) {
    throw new Error(describeComposerError(error), { cause: error })
  }
}

function describeComposerError(error: unknown): string {
  if (typeof error !== 'object' || error === null) {
    return 'Composer failed.'
  }

  if ('code' in error && error.code === 'ENOENT') {
    return 'Composer was not found. Install Composer and PHP to update Composer-managed plugins.'
  }

  const stderr = 'stderr' in error && typeof error.stderr === 'string' ? error.stderr.trim() : ''
  const lastLines = stderr.split('\n').slice(-ERROR_LINES).join('\n')

  return lastLines ? `Composer failed:\n${lastLines}` : 'Composer failed.'
}
