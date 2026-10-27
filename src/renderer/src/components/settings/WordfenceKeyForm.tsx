import { useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldError } from '@/components/common/FieldError'
import { useSetWordfenceKey } from '@/hooks/useSettings'
import { getErrorMessage } from '@/lib/errors'

export function WordfenceKeyForm(): React.JSX.Element {
  const [apiKey, setApiKey] = useState('')
  const saveKey = useSetWordfenceKey()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    saveKey.mutate(apiKey)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="password"
          autoComplete="off"
          placeholder="Wordfence API key"
          aria-label="Wordfence API key"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          aria-invalid={saveKey.isError}
        />
        <Button type="submit" disabled={!apiKey.trim() || saveKey.isPending}>
          {saveKey.isPending && <Loader2Icon data-icon="inline-start" className="animate-spin" />}
          Save
        </Button>
      </div>
      <FieldError message={saveKey.isError ? getErrorMessage(saveKey.error) : null} />
    </form>
  )
}
