import { CircleAlertIcon, CircleCheckIcon, Loader2Icon, ShieldAlertIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatusTone = 'loading' | 'success' | 'warning' | 'error'

const toneIcons = {
  loading: { icon: Loader2Icon, className: 'animate-spin text-muted-foreground' },
  success: { icon: CircleCheckIcon, className: 'text-muted-foreground' },
  warning: { icon: ShieldAlertIcon, className: 'text-orange-600 dark:text-orange-400' },
  error: { icon: CircleAlertIcon, className: 'text-destructive' }
}

type StatusLineProps = {
  tone: StatusTone
  children: React.ReactNode
}

export function StatusLine({ tone, children }: StatusLineProps): React.JSX.Element {
  const { icon: Icon, className } = toneIcons[tone]

  return (
    <p
      className={cn(
        'flex items-center gap-2 text-sm',
        tone === 'error' ? 'text-destructive' : 'text-muted-foreground'
      )}
    >
      <Icon className={cn('size-4 shrink-0', className)} />
      <span>{children}</span>
    </p>
  )
}
