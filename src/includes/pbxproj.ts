import * as fs from './fs'
import * as path from 'path'
import config from '../config'

type Callback = (data: string) => string[]

function readBlock(sectionName: string, callback: Callback): string | undefined {
  const c = config()
  const file = path.join(c.rootDir, c.ios.projectDir, 'App', 'App.xcodeproj', 'project.pbxproj')
  const lines = fs.readFileLinesSync(file)

  const start = lines.indexOf(`/* Begin ${sectionName} section */`)
  const end = lines.indexOf(`/* End ${sectionName} section */`)

  for (let i = start; i < end; i++) {
    const [action, value] = callback(lines[i])
    switch (action) {
      case 'return':
        return value
      case 'insert':
        lines.splice(i + 1, 0, value)
        fs.writeFileSync(file, lines.join('\n'))
        return
    }
  }
}

export function getBuildConfigurationId(releaseType: string): string {
  let target = false

  const id = readBlock('XCConfigurationList', (line: string) => {
    let result: string[] = []

    if (line.includes('/* Build configuration list for PBXNativeTarget "App" */')) {
      target = true
    }

    if (target === true && line.includes(`/* ${releaseType} */`)) {
      result = ['return', line.replace(/\W*(\w+).*/, '$1')]
    }
    return result
  })

  if (!id) return ''
  return id
}

export function addBuildSetting(id: string, releaseType: string, key: string, value: string): void {
  let target = false

  readBlock('XCBuildConfiguration', (line: string) => {
    let result: string[] = []

    if (line.includes(`${id} /* ${releaseType} */`)) {
      target = true
    }

    if (target === true && line.includes('buildSettings')) {
      result = ['insert', `\t\t\t\t${key} = ${value}`]
    }

    return result
  })
}

export function addFileToPBXGroup(key: string, value: string): void {
  readBlock('PBXGroup', (line: string) => {
    let result: string[] = []

    if (line.includes('/* Info.plist */')) {
      result = ['insert', `\t\t\t\t${key} ${value}`]
    }

    return result
  })
}

export function addPBXFileReference(key: string, value: string): void {
  readBlock('PBXFileReference', () => {
    return ['insert', `\t\t${key} ${value}`]
  })
}

export function addPBXBuildFile(key: string, value: string): void {
  readBlock('PBXBuildFile', () => {
    return ['insert', `\t\t${key} ${value}`]
  })
}

export function addPBXResourcesBuildPhase(key: string, value: string): void {
  readBlock('PBXResourcesBuildPhase', (line: string) => {
    let result: string[] = []

    if (line.includes('/* config.xml in Resources */')) {
      result = ['insert', `\t\t\t\t${key} ${value}`]
    }

    return result
  })
}
