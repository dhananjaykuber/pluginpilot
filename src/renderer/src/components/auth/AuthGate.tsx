import { useGitHubUser } from '@/hooks/useGitHubUser'
import { getErrorMessage } from '@/lib/errors'
import { AuthErrorScreen } from './AuthErrorScreen'
import { ConnectGitHubScreen } from './ConnectGitHubScreen'

type AuthGateProps = {
  children: React.ReactNode
}

export function AuthGate({ children }: AuthGateProps): React.JSX.Element | null {
  const { data: user, isPending, isError, error, refetch } = useGitHubUser()

  if (isPending) {
    return null
  }

  if (isError) {
    return <AuthErrorScreen message={getErrorMessage(error)} onRetry={() => refetch()} />
  }

  if (!user) {
    return <ConnectGitHubScreen />
  }

  return <>{children}</>
}
