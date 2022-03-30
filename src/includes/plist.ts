import * as fs from 'fs'
import * as plist from 'plist'

export type Options = {[key: string]: boolean | string | string[]}

export function mergeEntries(filename: string, options: Options): void {
  const json = fs.existsSync(filename) ? JSON.parse(JSON.stringify(plist.parse(fs.readFileSync(filename, 'utf8')))) : {}

  fs.writeFileSync(filename, plist.build({...json, ...options}))
}
