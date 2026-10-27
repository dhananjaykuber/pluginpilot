import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthScreenLayout } from './AuthScreenLayout'

type AuthErrorScreenProps = {
  message: string
  onRetry: () => void
}

export function AuthErrorScreen({ message, onRetry }: AuthErrorScreenProps): React.JSX.Element {
  return (
    <AuthScreenLayout>
      <Card>
        <CardHeader>
          <CardTitle>Couldn&apos;t reach GitHub</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={onRetry}>
            Try again
          </Button>
        </CardContent>
      </Card>
    </AuthScreenLayout>
  )
}
