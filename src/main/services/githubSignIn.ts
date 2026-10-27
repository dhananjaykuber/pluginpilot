import type { DeviceCodePrompt, GitHubUser } from '../../shared/types'
import { pollForAccessToken, requestDeviceCode, type DeviceCode } from './githubDeviceFlow'
import { signInWithToken } from './auth'

type PendingSignIn = {
  code: DeviceCode
  controller: AbortController
}

// Only one sign-in can be in progress at a time.
let pendingSignIn: PendingSignIn | null = null

export async function startGitHubSignIn(): Promise<DeviceCodePrompt> {
  cancelGitHubSignIn()

  const code = await requestDeviceCode()
  pendingSignIn = { code, controller: new AbortController() }

  return {
    userCode: code.userCode,
    verificationUri: code.verificationUri,
    expiresAt: code.expiresAt.toISOString()
  }
}

export async function completeGitHubSignIn(): Promise<GitHubUser> {
  const signIn = pendingSignIn

  if (!signIn) {
    throw new Error('Sign-in was not started. Please try again.')
  }

  try {
    const token = await pollForAccessToken(signIn.code, signIn.controller.signal)
    return await signInWithToken(token)
  } finally {
    if (pendingSignIn === signIn) {
      pendingSignIn = null
    }
  }
}

export function cancelGitHubSignIn(): void {
  pendingSignIn?.controller.abort()
  pendingSignIn = null
}
