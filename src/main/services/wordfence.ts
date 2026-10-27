// Wordfence Intelligence v3 feed. The production feed has fully analysed records with CVSS scores.
const FEED_URL = 'https://www.wordfence.com/api/intelligence/v3/vulnerabilities/production'

export async function verifyWordfenceKey(apiKey: string): Promise<void> {
  const response = await requestFeed(apiKey)

  // Only the status matters here, so skip downloading the large feed body.
  await response.body?.cancel()
}

export async function downloadVulnerabilityFeed(apiKey: string): Promise<string> {
  const response = await requestFeed(apiKey)
  return response.text()
}

async function requestFeed(apiKey: string): Promise<Response> {
  const response = await fetch(FEED_URL, { headers: { Authorization: `Bearer ${apiKey}` } })

  if (response.status === 401 || response.status === 403) {
    throw new Error('Wordfence rejected this API key. Check that it is correct.')
  }

  if (!response.ok) {
    throw new Error(`Wordfence responded with status ${response.status}.`)
  }

  return response
}
