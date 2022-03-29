import * as fs from './fs'
import * as path from 'path'
import config from '../config'

export function addPod(podName: string): void {
  const c = config()
  const filename = path.join(c.rootDir, c.ios.projectDir, 'App', 'Podfile')
  const lines = fs.readFileLinesSync(filename)
  let target = false

  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]

    if (/^target 'App' do$/.test(line)) target = true

    if (target === true && /^end$/.test(line)) {
      lines.splice(i, 0, `  pod '${podName}'`)
      break
    }
  }

  fs.writeFileSync(filename, lines.join('\n'))
}
