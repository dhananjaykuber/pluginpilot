import { CircleCheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useClearWordfenceKey } from '@/hooks/useSettings'

export function WordfenceKeySaved(): React.JSX.Element {
  const clearKey = useClearWordfenceKey()

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="flex items-center gap-2 text-sm">
        <CircleCheckIcon className="size-4 text-emerald-600 dark:text-emerald-500" />
        Wordfence API key saved
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => clearKey.mutate()}
        disabled={clearKey.isPending}
      >
        Remove key
      </Button>
    </div>
  )
}
