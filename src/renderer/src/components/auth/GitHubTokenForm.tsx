import { useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConnectGitHub } from '@/hooks/useConnectGitHub'
import { getErrorMessage } from '@/lib/errors'
import { TokenHelpText } from './TokenHelpText'

export function GitHubTokenForm(): React.JSX.Element {
  const [token, setToken] = useState('')
  const connect = useConnectGitHub()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    connect.mutate(token)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TokenHelpText />
      <div className="space-y-2">
        <Label htmlFor="github-token">Personal access token</Label>
        <Input
          id="github-token"
          type="password"
          autoComplete="off"
          placeholder="ghp_..."
          value={token}
          onChange={(event) => setToken(event.target.value)}
          aria-invalid={connect.isError}
        />
        {connect.isError && (
          <p className="text-sm text-destructive">{getErrorMessage(connect.error)}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={!token.trim() || connect.isPending}>
        {connect.isPending && <Loader2Icon data-icon="inline-start" className="animate-spin" />}
        Connect
      </Button>
    </form>
  )
}
