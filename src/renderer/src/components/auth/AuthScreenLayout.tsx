import { PlugIcon } from 'lucide-react'

type AuthScreenLayoutProps = {
  children: React.ReactNode
}

export function AuthScreenLayout({ children }: AuthScreenLayoutProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/40 p-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
          <PlugIcon className="size-4" />
        </span>
        PluginPilot
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
