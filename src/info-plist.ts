import * as path from 'path'
import * as plist from './includes/plist'
import config from './config'

export async function setOptions(): Promise<void> {
  const c = config()
  const filename = path.join(c.rootDir, c.ios.projectDir, 'App', 'App', 'Info.plist')
  plist.mergeEntries(filename, config().ios['Info.plist'])
}
