import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DeviceCodePrompt } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

type GitHubSignIn = {
  start: () => void
  cancel: () => void
  prompt: DeviceCodePrompt | null
  isPending: boolean
  error: Error | null
}

export function useGitHubSignIn(): GitHubSignIn {
  const queryClient = useQueryClient()
  const [prompt, setPrompt] = useState<DeviceCodePrompt | null>(null)

  const signIn = useMutation({
    mutationFn: async () => {
      setPrompt(await window.api.auth.startSignIn())
      return window.api.auth.completeSignIn()
    },
    onSuccess: (user) => queryClient.setQueryData(queryKeys.githubUser, user),
    onSettled: () => setPrompt(null)
  })

  // Stop polling GitHub if the user leaves the sign-in screen mid-way.
  useEffect(() => {
    return () => {
      window.api.auth.cancelSignIn()
    }
  }, [])

  function cancel(): void {
    window.api.auth.cancelSignIn()
    signIn.reset()
    setPrompt(null)
  }

  return {
    start: () => signIn.mutate(),
    cancel,
    prompt,
    isPending: signIn.isPending,
    error: signIn.error
  }
}
