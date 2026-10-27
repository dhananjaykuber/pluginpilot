import { CircleAlertIcon, CircleCheckIcon, CircleMinusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SetupStatus = 'found' | 'warning' | 'missing'

const statusIcons = {
  found: { icon: CircleCheckIcon, className: 'text-emerald-600 dark:text-emerald-500' },
  warning: { icon: CircleAlertIcon, className: 'text-amber-600 dark:text-amber-500' },
  missing: { icon: CircleMinusIcon, className: 'text-muted-foreground' }
}

type SetupRowProps = {
  label: string
  status: SetupStatus
  children: React.ReactNode
}

export function SetupRow({ label, status, children }: SetupRowProps): React.JSX.Element {
  const { icon: Icon, className } = statusIcons[status]

  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-start gap-2">
        <Icon className={cn('mt-0.5 size-4 shrink-0', className)} />
        <div className="min-w-0 space-y-1">{children}</div>
      </dd>
    </div>
  )
}
