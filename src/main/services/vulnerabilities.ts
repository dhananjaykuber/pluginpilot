import type { PluginVersion, VulnerabilityReport } from '../../shared/types'
import { getSecret } from './secrets'
import { getVulnerabilityFeed } from './vulnerabilityFeed'
import { findVulnerabilities } from './vulnerabilityMatching'

// Returns null when no Wordfence API key is configured.
export async function checkPluginVulnerabilities(
  plugins: PluginVersion[]
): Promise<VulnerabilityReport | null> {
  const apiKey = getSecret('encryptedWordfenceKey')

  if (!apiKey) {
    return null
  }

  const feed = await getVulnerabilityFeed(apiKey)
  const bySlug = Object.fromEntries(
    plugins.map(({ slug, version }) => [
      slug,
      version ? findVulnerabilities(feed.index, slug, version) : []
    ])
  )

  return { feedUpdatedAt: feed.updatedAt.toISOString(), bySlug }
}
