import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult
} from '@tanstack/react-query'
import type { AppSettings } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

export function useSettings(): UseQueryResult<AppSettings> {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => window.api.settings.get()
  })
}

export function useSetWordfenceKey(): UseMutationResult<AppSettings, Error, string> {
  return useSettingsMutation((apiKey: string) => window.api.settings.setWordfenceKey(apiKey))
}

export function useClearWordfenceKey(): UseMutationResult<AppSettings, Error, void> {
  return useSettingsMutation(() => window.api.settings.clearWordfenceKey())
}

// Changing the Wordfence key changes vulnerability results, so those are refetched too.
function useSettingsMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<AppSettings>
): UseMutationResult<AppSettings, Error, TVariables> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.settings, settings)
      queryClient.invalidateQueries({ queryKey: queryKeys.vulnerabilities })
    }
  })
}
