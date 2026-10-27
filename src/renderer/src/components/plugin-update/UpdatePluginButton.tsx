import { useState } from 'react'
import { GitPullRequestArrowIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { NewPluginUpdate } from '@/lib/pluginUpdate'
import { UpdatePluginDialog } from './UpdatePluginDialog'

type UpdatePluginButtonProps = {
  update: NewPluginUpdate
  baseBranch: string
}

export function UpdatePluginButton({
  update,
  baseBranch
}: UpdatePluginButtonProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
        <GitPullRequestArrowIcon data-icon="inline-start" />
        Update
      </Button>
      {isOpen && (
        <UpdatePluginDialog
          update={update}
          baseBranch={baseBranch}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
