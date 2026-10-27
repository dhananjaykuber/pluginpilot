import { useState } from 'react'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import type { PluginUpdateResult, PluginUpdateStep } from '@shared/types'
import type { NewPluginUpdate } from '@/lib/pluginUpdate'

type UpdatePlugin = UseMutationResult<PluginUpdateResult, Error, NewPluginUpdate> & {
  step: PluginUpdateStep | null
}

export function useUpdatePlugin(): UpdatePlugin {
  const [step, setStep] = useState<PluginUpdateStep | null>(null)

  const mutation = useMutation({
    mutationFn: async (update: NewPluginUpdate) => {
      const updateId = crypto.randomUUID()
      const stopListening = window.api.plugins.onUpdateProgress((progress) => {
        if (progress.updateId === updateId) {
          setStep(progress.step)
        }
      })

      try {
        return await window.api.plugins.update({ ...update, updateId })
      } finally {
        stopListening()
      }
    },
    onMutate: () => setStep(null)
  })

  return { ...mutation, step }
}
