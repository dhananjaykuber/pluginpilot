import type { AppSettings } from '../../shared/types'
import { store } from '../store'
import { scheduleBackgroundChecks } from './backgroundChecks'
import { clearSecret, getSecret, saveSecret } from './secrets'
import { verifyWordfenceKey } from './wordfence'

export function getSettings(): AppSettings {
  return {
    hasWordfenceKey: getSecret('encryptedWordfenceKey') !== null,
    backgroundChecks: store.get('backgroundChecks')
  }
}

export async function setWordfenceKey(apiKey: string): Promise<AppSettings> {
  const trimmedKey = apiKey.trim()

  await verifyWordfenceKey(trimmedKey)
  saveSecret('encryptedWordfenceKey', trimmedKey)

  return getSettings()
}

export function clearWordfenceKey(): AppSettings {
  clearSecret('encryptedWordfenceKey')
  return getSettings()
}

export function setBackgroundChecks(enabled: boolean): AppSettings {
  store.set('backgroundChecks', enabled)
  scheduleBackgroundChecks()
  return getSettings()
}
