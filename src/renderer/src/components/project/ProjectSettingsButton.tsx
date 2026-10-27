import { Link } from 'react-router'
import { SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { paths } from '@/lib/paths'

type ProjectSettingsButtonProps = {
  projectId: string
}

export function ProjectSettingsButton({
  projectId
}: ProjectSettingsButtonProps): React.JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            render={<Link to={paths.projectSettings(projectId)} />}
            nativeButton={false}
            aria-label="Project settings"
          />
        }
      >
        <SettingsIcon />
      </TooltipTrigger>
      <TooltipContent>Project settings</TooltipContent>
    </Tooltip>
  )
}
