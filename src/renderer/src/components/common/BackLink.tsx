import { Link } from 'react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type BackLinkProps = {
  to: string
  label: string
}

export function BackLink({ to, label }: BackLinkProps): React.JSX.Element {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 text-muted-foreground"
      render={<Link to={to} />}
      nativeButton={false}
    >
      <ArrowLeftIcon data-icon="inline-start" />
      Back to {label}
    </Button>
  )
}
