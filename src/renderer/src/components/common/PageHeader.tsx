import { BackLink } from './BackLink'
import { PageBreadcrumbs, type Crumb } from './PageBreadcrumbs'

type PageHeaderProps = {
  title: string
  description?: string
  breadcrumbs?: Crumb[]
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions
}: PageHeaderProps): React.JSX.Element {
  const parent = breadcrumbs && findParentCrumb(breadcrumbs)

  return (
    <header className="mb-6 space-y-3">
      {parent?.to && <BackLink to={parent.to} label={parent.label} />}
      {breadcrumbs && <PageBreadcrumbs items={breadcrumbs} />}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}

// Back goes up to the closest linked breadcrumb, so it never depends on navigation history.
function findParentCrumb(breadcrumbs: Crumb[]): Crumb | undefined {
  return breadcrumbs.findLast((crumb) => crumb.to)
}
