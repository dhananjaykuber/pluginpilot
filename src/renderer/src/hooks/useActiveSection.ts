import { useLocation } from 'react-router'
import { paths } from '@/lib/paths'

export type AppSection = 'projects' | 'settings'

export function useActiveSection(): AppSection {
  const { pathname } = useLocation()

  return pathname.startsWith(paths.settings) ? 'settings' : 'projects'
}
