import type { PluginUpdateRequest } from '../../shared/types'

export function buildUpdateTitle(request: PluginUpdateRequest): string {
  return `Update ${request.name} from ${request.fromVersion} to ${request.toVersion}`
}

export function buildUpdateBody(request: PluginUpdateRequest, baseBranch: string): string {
  const sections = [
    '## Plugin update',
    // GitHub tables need a header row, so the plugin row doubles as the header.
    [
      `| Plugin | ${request.name} (\`${request.slug}\`) |`,
      '|---|---|',
      `| Version | \`${request.fromVersion}\` → \`${request.toVersion}\` |`,
      `| Environment | ${request.environmentName} (\`${baseBranch}\`) |`,
      `| Path | \`${request.path}\` |`
    ].join('\n'),
    buildSecuritySection(request),
    `### Changelog\n\nhttps://wordpress.org/plugins/${request.slug}/#developers`
  ]

  return sections.filter(Boolean).join('\n\n')
}

function buildSecuritySection(request: PluginUpdateRequest): string | null {
  if (request.securityFixes.length === 0) {
    return null
  }

  const fixes = request.securityFixes.map((fix) =>
    fix.cve ? `- ${fix.title} (${fix.cve})` : `- ${fix.title}`
  )

  return ['### Security fixes', '', ...fixes].join('\n')
}
