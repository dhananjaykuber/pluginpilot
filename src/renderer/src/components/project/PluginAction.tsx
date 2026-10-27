import type { PluginListItem } from '@/lib/plugins'
import { canUpdateFromZip, toPluginUpdate, type UpdateTarget } from '@/lib/pluginUpdate'
import { UpdatePluginButton } from '@/components/plugin-update/UpdatePluginButton'
import { UploadZipButton } from '@/components/plugin-update/UploadZipButton'
import { PullRequestLink } from './PullRequestLink'

type PluginActionProps = {
  plugin: PluginListItem
  target: UpdateTarget
}

// An open pull request wins over starting a new update.
export function PluginAction({ plugin, target }: PluginActionProps): React.JSX.Element | null {
  if (plugin.pullRequest) {
    return <PullRequestLink pullRequest={plugin.pullRequest} />
  }

  const update = toPluginUpdate(plugin, target)

  if (update) {
    return <UpdatePluginButton update={update} baseBranch={target.environment.branch} />
  }

  if (canUpdateFromZip(plugin)) {
    return <UploadZipButton plugin={plugin} target={target} />
  }

  return null
}
