import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthScreenLayout } from './AuthScreenLayout'
import { GitHubSignIn } from './GitHubSignIn'
import { GitHubTokenForm } from './GitHubTokenForm'

type ConnectMethod = 'sign-in' | 'token'

export function ConnectGitHubScreen(): React.JSX.Element {
  const [method, setMethod] = useState<ConnectMethod>('sign-in')

  return (
    <AuthScreenLayout>
      <Card>
        <CardHeader>
          <CardTitle>Connect GitHub</CardTitle>
          <CardDescription>
            PluginPilot needs access to your repositories to scan plugins and open pull requests.
            Your access is encrypted and stored only on this machine.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {method === 'sign-in' ? <GitHubSignIn /> : <GitHubTokenForm />}
          <Button
            variant="link"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => setMethod(method === 'sign-in' ? 'token' : 'sign-in')}
          >
            {method === 'sign-in'
              ? 'Use a personal access token instead'
              : 'Back to Sign in with GitHub'}
          </Button>
        </CardContent>
      </Card>
    </AuthScreenLayout>
  )
}
