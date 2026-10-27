type ExternalLinkProps = {
  href: string
  children: React.ReactNode
}

// Opens in the default browser through the main window's open handler.
export function ExternalLink({ href, children }: ExternalLinkProps): React.JSX.Element {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-foreground underline underline-offset-4"
    >
      {children}
    </a>
  )
}
