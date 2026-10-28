import type { Project } from '@shared/types'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { GitHubIcon } from '@/components/common/GitHubIcon'

type ViewOnGitHubButtonProps = {
  repo: Project['repo']
  // The environment branch to open; the repository's default view when null.
  branch: string | null
}

// Opens in the default browser through the main window's open handler.
export function ViewOnGitHubButton({ repo, branch }: ViewOnGitHubButtonProps): React.JSX.Element {
  const label = branch ? `View ${branch} on GitHub` : 'View on GitHub'

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            render={<a href={getRepositoryUrl(repo, branch)} target="_blank" rel="noreferrer" />}
            nativeButton={false}
            aria-label={label}
          />
        }
      >
        <GitHubIcon />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

// "plugin/develop" stays readable: each path segment is encoded, the slashes are kept.
function getRepositoryUrl(repo: Project['repo'], branch: string | null): string {
  const base = `https://github.com/${repo.owner}/${repo.name}`
  return branch ? `${base}/tree/${branch.split('/').map(encodeURIComponent).join('/')}` : base
}
