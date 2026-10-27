import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthScreenLayout } from './AuthScreenLayout'
import { GitHubTokenForm } from './GitHubTokenForm'

export function ConnectGitHubScreen(): React.JSX.Element {
  return (
    <AuthScreenLayout>
      <Card>
        <CardHeader>
          <CardTitle>Connect GitHub</CardTitle>
          <CardDescription>
            PluginPilot uses a personal access token to read your repositories and open pull
            requests. The token is encrypted and stored only on this machine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GitHubTokenForm />
        </CardContent>
      </Card>
    </AuthScreenLayout>
  )
}
