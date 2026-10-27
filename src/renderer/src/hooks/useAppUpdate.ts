import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult
} from '@tanstack/react-query'
import type { AppUpdate } from '@shared/types'
import { queryKeys } from '@/lib/queryClient'

const CHECK_INTERVAL = 6 * 60 * 60 * 1000

// Checks when the app opens, then every few hours while it stays open.
export function useAppUpdate(): UseQueryResult<AppUpdate | null> {
  return useQuery({
    queryKey: queryKeys.appUpdate,
    queryFn: () => window.api.app.checkForUpdate(),
    staleTime: CHECK_INTERVAL,
    refetchInterval: CHECK_INTERVAL,
    retry: false
  })
}

export function useDownloadAppUpdate(): UseMutationResult<void, Error, AppUpdate> {
  return useMutation({
    mutationFn: (update) => window.api.app.downloadUpdate(update)
  })
}
