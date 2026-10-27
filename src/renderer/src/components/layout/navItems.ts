import { FolderGit2Icon, SettingsIcon, type LucideIcon } from 'lucide-react'
import type { AppSection } from '@/hooks/useActiveSection'
import { paths } from '@/lib/paths'

export type NavItem = {
  section: AppSection
  label: string
  to: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { section: 'projects', label: 'Projects', to: paths.projects, icon: FolderGit2Icon },
  { section: 'settings', label: 'Settings', to: paths.settings, icon: SettingsIcon }
]
