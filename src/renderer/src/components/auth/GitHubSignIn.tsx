import { Loader2Icon, LogInIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGitHubSignIn } from '@/hooks/useGitHubSignIn'
import { getErrorMessage } from '@/lib/errors'
import { DeviceCodePanel } from './DeviceCodePanel'

export function GitHubSignIn(): React.JSX.Element {
  const { start, cancel, prompt, isPending, error } = useGitHubSignIn()

  if (prompt) {
    return <DeviceCodePanel prompt={prompt} onCancel={cancel} />
  }

  return (
    <div className="space-y-3">
      <Button className="w-full" onClick={start} disabled={isPending}>
        {isPending ? (
          <Loader2Icon data-icon="inline-start" className="animate-spin" />
        ) : (
          <LogInIcon data-icon="inline-start" />
        )}
        Sign in with GitHub
      </Button>
      {error && <p className="text-sm text-destructive">{getErrorMessage(error)}</p>}
    </div>
  )
}
