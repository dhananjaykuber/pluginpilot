// Electron prefixes errors thrown in IPC handlers with
// "Error invoking remote method '<channel>': Error: ", which users shouldn't see.
const IPC_ERROR_PREFIX = /^Error invoking remote method '[^']+': (?:\w*Error: )?/

export function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  return message.replace(IPC_ERROR_PREFIX, '')
}
