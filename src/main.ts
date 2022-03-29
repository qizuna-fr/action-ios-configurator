import * as core from '@actions/core'
import * as capability from './capability'
import * as infoPlist from './info-plist'

async function run(): Promise<void> {
  try {
    /* Info */
    infoPlist.setOptions()

    /* Push Notifications */
    capability.addPushNotifications()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
