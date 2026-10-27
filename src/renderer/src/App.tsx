import { HashRouter } from 'react-router'
import { ThemeProvider } from 'next-themes'
import { QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AuthGate } from '@/components/auth/AuthGate'
import { queryClient } from '@/lib/queryClient'
import { AppRoutes } from '@/routes'

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <AuthGate>
            <HashRouter>
              <AppRoutes />
            </HashRouter>
          </AuthGate>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
