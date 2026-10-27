import { HashRouter } from 'react-router'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { AppRoutes } from '@/routes'

function App(): React.JSX.Element {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
