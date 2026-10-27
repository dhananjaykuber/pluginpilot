import { CircleCheckIcon, CircleIcon, Loader2Icon } from 'lucide-react'
import type { PluginUpdateStep } from '@shared/types'
import { updateStepLabels, updateSteps } from '@/lib/pluginUpdate'
import { cn } from '@/lib/utils'

type UpdateProgressProps = {
  currentStep: PluginUpdateStep | null
}

export function UpdateProgress({ currentStep }: UpdateProgressProps): React.JSX.Element {
  // Before the first progress event arrives, the first step is in progress.
  const currentIndex = currentStep ? updateSteps.indexOf(currentStep) : 0

  return (
    <ol className="space-y-2 text-sm">
      {updateSteps.map((step, index) => {
        const Icon =
          index < currentIndex ? CircleCheckIcon : index === currentIndex ? Loader2Icon : CircleIcon

        return (
          <li
            key={step}
            className={cn(
              'flex items-center gap-2',
              index > currentIndex && 'text-muted-foreground'
            )}
          >
            <Icon
              className={cn(
                'size-4',
                index === currentIndex && 'animate-spin',
                index < currentIndex && 'text-emerald-600 dark:text-emerald-500'
              )}
            />
            {updateStepLabels[step]}
          </li>
        )
      })}
    </ol>
  )
}
