import { useState } from 'react'

export type PluginSelection = {
  isSelected: (slug: string) => boolean
  toggle: (slug: string) => void
  // Selects all `slugs`, or clears them when they're all selected already.
  toggleAll: (slugs: string[]) => void
  clear: () => void
  selectedSlugs: string[]
}

// `selectableSlugs` limits the selection to plugins that can still be updated, e.g. after
// a filter change or once a pull request exists for a plugin.
export function usePluginSelection(selectableSlugs: string[]): PluginSelection {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const selectedSlugs = selectableSlugs.filter((slug) => selected.has(slug))

  return {
    isSelected: (slug) => selected.has(slug),
    toggle: (slug) =>
      setSelected((current) => {
        const next = new Set(current)
        if (next.has(slug)) {
          next.delete(slug)
        } else {
          next.add(slug)
        }
        return next
      }),
    toggleAll: (slugs) =>
      setSelected((current) =>
        slugs.every((slug) => current.has(slug)) ? new Set() : new Set([...current, ...slugs])
      ),
    clear: () => setSelected(new Set()),
    selectedSlugs
  }
}
