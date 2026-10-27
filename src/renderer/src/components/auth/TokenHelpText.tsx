const NEW_TOKEN_URL = 'https://github.com/settings/tokens/new?scopes=repo&description=PluginPilot'

export function TokenHelpText(): React.JSX.Element {
  return (
    <p className="text-xs text-muted-foreground">
      <a
        href={NEW_TOKEN_URL}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-foreground underline underline-offset-4"
      >
        Create a classic token
      </a>{' '}
      with the <code>repo</code> scope. Fine-grained tokens also work with Contents and Pull
      requests set to read and write.
    </p>
  )
}
