import { useState } from 'react'
import type { PluginUpdateResult, PluginUpdateStep } from '@shared/types'
import { getErrorMessage } from '@/lib/errors'
import type { NewPluginUpdate } from '@/lib/pluginUpdate'
import { runPluginUpdate } from '@/lib/runPluginUpdate'

export type BulkItemState =
  | { status: 'queued' }
  | { status: 'running'; step: PluginUpdateStep | null }
  | { status: 'created'; result: PluginUpdateResult }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; error: string }

type BulkUpdate = {
  states: Record<string, BulkItemState>
  isRunning: boolean
  hasFinished: boolean
  run: (updates: NewPluginUpdate[]) => Promise<void>
}

// Creates one pull request per plugin, one after another, so a failure only affects
// that plugin and GitHub isn't flooded with parallel writes.
export function useBulkUpdate(): BulkUpdate {
  const [states, setStates] = useState<Record<string, BulkItemState>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)

  function setState(slug: string, state: BulkItemState): void {
    setStates((current) => ({ ...current, [slug]: state }))
  }

  async function run(updates: NewPluginUpdate[]): Promise<void> {
    setIsRunning(true)
    setStates(Object.fromEntries(updates.map((update) => [update.slug, { status: 'queued' }])))

    for (const update of updates) {
      setState(update.slug, { status: 'running', step: null })
      const finalState = await updateOne(update, (step) =>
        setState(update.slug, { status: 'running', step })
      )
      setState(update.slug, finalState)
    }

    setIsRunning(false)
    setHasFinished(true)
  }

  return { states, isRunning, hasFinished, run }
}

async function updateOne(
  update: NewPluginUpdate,
  onStep: (step: PluginUpdateStep) => void
): Promise<BulkItemState> {
  try {
    if (await hasLocalModifications(update)) {
      return {
        status: 'skipped',
        reason: 'Plugin files were changed by hand. Update it on its own to review the changes.'
      }
    }

    const changelog = await loadChangelog(update)
    const result = await runPluginUpdate({ ...update, changelog }, onStep)

    return { status: 'created', result }
  } catch (error) {
    return { status: 'failed', error: getErrorMessage(error) }
  }
}

// Same check as the single update dialog, but in bulk a modified plugin is skipped instead
// of asking for confirmation.
async function hasLocalModifications(update: NewPluginUpdate): Promise<boolean> {
  if (update.source !== 'manual' || update.zip.from !== 'wordpress-org') {
    return false
  }

  const modifications = await window.api.plugins.findModifications({
    projectId: update.projectId,
    environmentName: update.environmentName,
    slug: update.slug,
    path: update.path,
    version: update.fromVersion
  })

  return modifications.status === 'modified'
}

// Release notes are a nice-to-have, so a failure here doesn't stop the update.
async function loadChangelog(update: NewPluginUpdate): Promise<NewPluginUpdate['changelog']> {
  if (!update.changelogUrl) {
    return []
  }

  return window.api.plugins
    .getChangelog(update.slug, update.fromVersion, update.toVersion)
    .catch(() => [])
}
