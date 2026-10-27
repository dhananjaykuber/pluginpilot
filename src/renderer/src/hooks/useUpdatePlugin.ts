import { useState } from 'react'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import type { PluginUpdateResult, PluginUpdateStep } from '@shared/types'
import type { NewPluginUpdate } from '@/lib/pluginUpdate'
import { runPluginUpdate } from '@/lib/runPluginUpdate'

type UpdatePlugin = UseMutationResult<PluginUpdateResult, Error, NewPluginUpdate> & {
  step: PluginUpdateStep | null
}

export function useUpdatePlugin(): UpdatePlugin {
  const [step, setStep] = useState<PluginUpdateStep | null>(null)

  const mutation = useMutation({
    mutationFn: (update: NewPluginUpdate) => runPluginUpdate(update, setStep),
    onMutate: () => setStep(null)
  })

  return { ...mutation, step }
}
