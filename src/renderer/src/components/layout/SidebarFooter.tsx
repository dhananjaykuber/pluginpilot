import { useAppVersion } from '@/hooks/useAppVersion'

export function SidebarFooter(): React.JSX.Element {
  const { data: version } = useAppVersion()

  return (
    <footer className="mt-auto border-t px-4 py-3 text-xs text-muted-foreground">
      PluginPilot{version && ` v${version}`}
    </footer>
  )
}
