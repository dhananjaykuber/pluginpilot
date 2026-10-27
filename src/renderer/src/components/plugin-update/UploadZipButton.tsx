import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { FileArchiveIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/errors'
import type { PluginListItem } from '@/lib/plugins'
import { toZipUpdate, type NewPluginUpdate, type UpdateTarget } from '@/lib/pluginUpdate'
import { UpdatePluginDialog } from './UpdatePluginDialog'

type UploadZipButtonProps = {
  plugin: PluginListItem
  target: UpdateTarget
}

// Lets the user pick a vendor zip for plugins that aren't on WordPress.org, then opens
// the usual update dialog for it.
export function UploadZipButton({ plugin, target }: UploadZipButtonProps): React.JSX.Element {
  const [update, setUpdate] = useState<NewPluginUpdate | null>(null)

  const chooseZip = useMutation({
    mutationFn: () =>
      window.api.plugins.chooseZip({ name: plugin.name, version: plugin.version ?? '' }),
    onSuccess: (zip) => zip && setUpdate(toZipUpdate(plugin, target, zip)),
    onError: (error) => toast.error(getErrorMessage(error))
  })

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => chooseZip.mutate()}
        disabled={chooseZip.isPending}
      >
        {chooseZip.isPending ? (
          <Loader2Icon data-icon="inline-start" className="animate-spin" />
        ) : (
          <FileArchiveIcon data-icon="inline-start" />
        )}
        Upload zip
      </Button>
      {update && (
        <UpdatePluginDialog
          update={update}
          baseBranch={target.environment.branch}
          onClose={() => setUpdate(null)}
        />
      )}
    </>
  )
}
