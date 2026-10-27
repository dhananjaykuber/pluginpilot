import { ExternalLinkIcon, Loader2Icon } from 'lucide-react'
import type { DeviceCodePrompt } from '@shared/types'
import { Button } from '@/components/ui/button'

type DeviceCodePanelProps = {
  prompt: DeviceCodePrompt
  onCancel: () => void
}

export function DeviceCodePanel({ prompt, onCancel }: DeviceCodePanelProps): React.JSX.Element {
  async function copyCodeAndOpenGitHub(): Promise<void> {
    await navigator.clipboard.writeText(prompt.userCode)
    window.open(prompt.verificationUri, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border bg-muted/50 p-4 text-center">
        <p className="text-sm text-muted-foreground">Enter this code on GitHub</p>
        <p className="font-mono text-3xl font-semibold tracking-widest select-all">
          {prompt.userCode}
        </p>
      </div>
      <Button className="w-full" onClick={copyCodeAndOpenGitHub}>
        <ExternalLinkIcon data-icon="inline-start" />
        Copy code and open GitHub
      </Button>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Loader2Icon className="size-4 animate-spin" />
          Waiting for authorization…
        </span>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Only enter a code shown here. Never enter a code that someone sends you.
      </p>
    </div>
  )
}
