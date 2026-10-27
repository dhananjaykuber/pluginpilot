import { useSearchParams } from 'react-router'

export type ProjectView = 'plugins' | 'compare'

const VIEW_PARAM = 'view'

// Keeps the project page's tab in the URL, next to the selected environment.
export function useProjectView(): [ProjectView, (view: ProjectView) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const view: ProjectView = searchParams.get(VIEW_PARAM) === 'compare' ? 'compare' : 'plugins'

  function setView(next: ProjectView): void {
    setSearchParams(
      (params) => {
        params.set(VIEW_PARAM, next)
        return params
      },
      { replace: true }
    )
  }

  return [view, setView]
}
