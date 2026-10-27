import { useState } from 'react'
import { DownloadIcon, SparklesIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/common/ExternalLink'
import { useAppUpdate, useDownloadAppUpdate } from '@/hooks/useAppUpdate'
import { getErrorMessage } from '@/lib/errors'

export function AppUpdateBanner(): React.JSX.Element | null {
  const { data: update } = useAppUpdate()
  const download = useDownloadAppUpdate()
  // Hidden until the app restarts, or until an even newer version comes out.
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null)

  if (!update || update.version === dismissedVersion) {
    return null
  }

  function handleDownload(): void {
    if (!update) {
      return
    }

    download.mutate(update, {
      onSuccess: () =>
        toast.success('Installer opened', {
          description: 'Drag PluginPilot into Applications, then reopen the app.'
        }),
      onError: (error) => toast.error(getErrorMessage(error))
    })
  }

  return (
    <div className="flex items-center gap-3 border-b bg-card px-4 py-2 text-sm">
      <SparklesIcon className="size-4 text-primary" />
      <p className="flex-1">
        PluginPilot {update.version} is available ·{' '}
        <ExternalLink href={update.releaseUrl}>What&apos;s new</ExternalLink>
      </p>
      <Button size="sm" onClick={handleDownload} disabled={download.isPending}>
        <DownloadIcon data-icon="inline-start" />
        {download.isPending ? 'Downloading…' : 'Download'}
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Dismiss"
        onClick={() => setDismissedVersion(update.version)}
      >
        <XIcon />
      </Button>
    </div>
  )
}
