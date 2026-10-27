import type { PluginUpdateResult, PluginUpdateStep } from '@shared/types'
import type { NewPluginUpdate } from './pluginUpdate'

// Runs one update in the main process and reports its progress steps.
export async function runPluginUpdate(
  update: NewPluginUpdate,
  onStep: (step: PluginUpdateStep) => void
): Promise<PluginUpdateResult> {
  const updateId = crypto.randomUUID()
  const stopListening = window.api.plugins.onUpdateProgress((progress) => {
    if (progress.updateId === updateId) {
      onStep(progress.step)
    }
  })

  try {
    return await window.api.plugins.update({ ...update, updateId })
  } finally {
    stopListening()
  }
}
