import { ExternalLink } from '@/components/common/ExternalLink'

const NEW_TOKEN_URL = 'https://github.com/settings/tokens/new?scopes=repo&description=PluginPilot'

export function TokenHelpText(): React.JSX.Element {
  return (
    <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
      <li>
        <ExternalLink href={NEW_TOKEN_URL}>Create a classic token</ExternalLink> with the{' '}
        <code>repo</code> scope. A 90-day expiration is recommended.
      </li>
      <li>
        If your organizations use SSO, click <strong>Configure SSO</strong> next to the token and
        authorize each organization.
      </li>
      <li>Paste the token below.</li>
    </ol>
  )
}
