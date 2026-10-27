import type { PluginUpdateRequest } from '../../shared/types'

// Keeps the description readable when many versions are skipped; the link has the rest.
const MAX_CHANGELOG_VERSIONS = 10

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
      request.source === 'composer'
        ? `| Composer package | \`${request.packageName}\` |`
        : `| Path | \`${request.path}\` |`,
      buildRequirementsRow(request)
    ]
      .filter(Boolean)
      .join('\n'),
    buildSecuritySection(request),
    buildChangelogSection(request)
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

function buildChangelogSection(request: PluginUpdateRequest): string | null {
  if (!request.changelogUrl) {
    return null
  }

  const entries = request.changelog
    .slice(0, MAX_CHANGELOG_VERSIONS)
    .map(({ version, notes }) => [`**${version}**`, ...notes.map((note) => `- ${note}`)].join('\n'))

  return ['### Changelog', ...entries, `[Full changelog](${request.changelogUrl})`].join('\n\n')
}

function buildRequirementsRow(request: PluginUpdateRequest): string | null {
  const { wordPress, php } = request.requirements ?? {}
  const parts = [wordPress && `WordPress ${wordPress}`, php && `PHP ${php}`].filter(Boolean)

  return parts.length > 0 ? `| Requires | ${parts.join(', ')} |` : null
}
