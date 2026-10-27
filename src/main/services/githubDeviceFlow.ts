import { setTimeout as wait } from 'node:timers/promises'
import { GITHUB_CLIENT_ID } from '../config'

const DEVICE_CODE_URL = 'https://github.com/login/device/code'
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const DEVICE_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:device_code'

export type DeviceCode = {
  deviceCode: string
  userCode: string
  verificationUri: string
  intervalSeconds: number
  expiresAt: Date
}

type GitHubOAuthError = {
  error?: string
  error_description?: string
}

type DeviceCodeResponse = GitHubOAuthError & {
  device_code: string
  user_code: string
  verification_uri: string
  expires_in: number
  interval: number
}

type AccessTokenResponse = GitHubOAuthError & {
  access_token?: string
  interval?: number
}

export async function requestDeviceCode(): Promise<DeviceCode> {
  if (!GITHUB_CLIENT_ID) {
    throw new Error('GitHub sign-in is not configured yet. Use a personal access token for now.')
  }

  const data = await postForm<DeviceCodeResponse>(DEVICE_CODE_URL, {
    client_id: GITHUB_CLIENT_ID
  })

  // GitHub answers an unknown client ID with a 404 and `{"error":"Not Found"}`.
  if (data.error === 'Not Found') {
    throw new Error('GitHub did not recognise the PluginPilot client ID. Check GITHUB_CLIENT_ID.')
  }

  if (data.error) {
    throw new Error(data.error_description ?? data.error)
  }

  return {
    deviceCode: data.device_code,
    userCode: data.user_code,
    verificationUri: data.verification_uri,
    intervalSeconds: data.interval,
    expiresAt: new Date(Date.now() + data.expires_in * 1000)
  }
}

// Polls GitHub until the user authorizes the device code in the browser.
export async function pollForAccessToken(code: DeviceCode, signal: AbortSignal): Promise<string> {
  let intervalSeconds = code.intervalSeconds

  while (Date.now() < code.expiresAt.getTime()) {
    await wait(intervalSeconds * 1000, undefined, { signal })

    const data = await postForm<AccessTokenResponse>(ACCESS_TOKEN_URL, {
      client_id: GITHUB_CLIENT_ID,
      device_code: code.deviceCode,
      grant_type: DEVICE_GRANT_TYPE
    })

    if (data.access_token) {
      return data.access_token
    }

    switch (data.error) {
      case 'authorization_pending':
        break
      case 'slow_down':
        intervalSeconds = data.interval ?? intervalSeconds + 5
        break
      case 'access_denied':
        throw new Error('Sign-in was cancelled on GitHub.')
      case 'expired_token':
        throw new Error('The sign-in code expired. Please try again.')
      default:
        throw new Error(data.error_description ?? 'GitHub sign-in failed. Please try again.')
    }
  }

  throw new Error('The sign-in code expired. Please try again.')
}

async function postForm<T extends GitHubOAuthError>(
  url: string,
  params: Record<string, string>
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams(params)
  })
  const data = (await response.json().catch(() => ({}))) as T

  if (!response.ok && !data.error) {
    throw new Error(`GitHub responded with status ${response.status}.`)
  }

  return data
}
