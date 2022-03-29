import * as fs from './fs'
import * as path from 'path'
import config from '../config'

function getAppDelegateFilePath(): string {
  const c = config()
  return path.join(c.rootDir, c.ios.projectDir, 'App', 'App', 'AppDelegate.swift')
}

export function addImport(importName: string): void {
  const appDelegateFilePath = getAppDelegateFilePath()
  const lines = fs.readFileLinesSync(appDelegateFilePath)

  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]

    if (/^$/.test(line) && /^import.*/.test(lines[i - 1])) {
      lines.splice(i, 0, `import ${importName}`)
      break
    }
  }
  fs.writeFileSync(appDelegateFilePath, lines.join('\n'))
}

export function addLinesToFunction(funcOrEventName: string, stringToInsert: string): void {
  const appDelegateFilePath = getAppDelegateFilePath()
  const lines = fs.readFileLinesSync(appDelegateFilePath)
  let target = false

  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]
    if (line.includes(funcOrEventName)) target = true

    if (target === true && line.includes('return')) {
      lines.splice(i, 0, stringToInsert)
      break
    }
  }
  fs.writeFileSync(appDelegateFilePath, lines.join('\n'))
}

export function addFunctionToMain(functionString: string): void {
  const appDelegateFilePath = getAppDelegateFilePath()
  const lines = fs.readFileLinesSync(appDelegateFilePath)

  for (let i = lines.length; i > 0; i--) {
    const line = lines[i]

    if (/^}$/.test(line)) {
      lines.splice(i, 0, functionString)
      break
    }
  }
  fs.writeFileSync(appDelegateFilePath, lines.join('\n'))
}
