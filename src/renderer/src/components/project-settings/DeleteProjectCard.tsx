import { useState } from 'react'
import type { Project } from '@shared/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DeleteProjectDialog } from './DeleteProjectDialog'

type DeleteProjectCardProps = {
  project: Project
}

export function DeleteProjectCard({ project }: DeleteProjectCardProps): React.JSX.Element {
  const [isConfirming, setIsConfirming] = useState(false)

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle>Delete project</CardTitle>
        <CardDescription>
          Removes this project from PluginPilot. The GitHub repository, its branches and pull
          requests are not changed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={() => setIsConfirming(true)}>
          Delete project
        </Button>
      </CardContent>
      {isConfirming && (
        <DeleteProjectDialog project={project} onClose={() => setIsConfirming(false)} />
      )}
    </Card>
  )
}
