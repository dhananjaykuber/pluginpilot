import { Link } from 'react-router'
import { PlugIcon } from 'lucide-react'
import { paths } from '@/lib/paths'

export function AppLogo(): React.JSX.Element {
  return (
    <Link to={paths.projects} className="flex items-center gap-2 text-sm font-semibold">
      <span className="flex size-6 items-center justify-center rounded-md bg-white text-zinc-950">
        <PlugIcon className="size-3.5" />
      </span>
      PluginPilot
    </Link>
  )
}
