import { Outlet } from 'react-router'
import { useScanAllSync } from '@/hooks/useScanAll'
import { AppUpdateBanner } from './AppUpdateBanner'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'

export function AppLayout(): React.JSX.Element {
  useScanAllSync()

  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <AppUpdateBanner />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/40 dark:bg-background">
          <div className="mx-auto max-w-6xl px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
