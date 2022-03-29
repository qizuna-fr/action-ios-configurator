import * as path from 'path'
import * as plist from './plist'
import config from '../config'

export function addCapability(options: plist.Options): void {
  const c = config()
  const filename = path.join(c.rootDir, c.ios.projectDir, 'App', 'App', 'App.entitlements')
  plist.mergeEntries(filename, options)
}
