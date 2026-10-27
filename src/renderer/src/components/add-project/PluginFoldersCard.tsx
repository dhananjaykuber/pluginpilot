import { PlusIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FieldError } from '@/components/common/FieldError'
import type { PluginPathDraft } from '@/lib/projectForm'

type PluginFoldersCardProps = {
  paths: PluginPathDraft[]
  error: string | null
  usesComposer: boolean
  onAdd: () => void
  onChange: (id: string, path: string) => void
  onRemove: (id: string) => void
}

export function PluginFoldersCard({
  paths,
  error,
  usesComposer,
  onAdd,
  onChange,
  onRemove
}: PluginFoldersCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plugin folders</CardTitle>
        <CardDescription>
          Folders with plugin code committed to the repository.
          {usesComposer && ' Composer-managed plugins are read from composer.json.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {paths.map((draft) => (
          <div key={draft.id} className="flex items-center gap-2">
            <Input
              value={draft.path}
              onChange={(event) => onChange(draft.id, event.target.value)}
              placeholder="wp-content/plugins"
              aria-label="Plugin folder path"
              className="font-mono"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(draft.id)}
              aria-label={`Remove ${draft.path || 'plugin folder'}`}
            >
              <Trash2Icon />
            </Button>
          </div>
        ))}
        <FieldError message={error} />
        <Button variant="outline" size="sm" onClick={onAdd}>
          <PlusIcon data-icon="inline-start" />
          Add folder
        </Button>
      </CardContent>
    </Card>
  )
}
