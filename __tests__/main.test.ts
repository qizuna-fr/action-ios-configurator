import {beforeAll, describe, expect, test} from '@jest/globals'
import * as process from 'process'
import * as cp from 'child_process'
import * as fs from '../src/includes/fs'
import * as path from 'path'
import config from '../src/config'

function resetFile(filename: string): string {
  if (fs.existsSync(filename)) {
    fs.rmSync(filename)
  }
  fs.cpSync(`${filename}.sample`, filename)
  return filename
}

function parsePlist(filename: string, keyName: string, keyType: string): string | undefined {
  const lines = fs.readFileLinesSync(filename)
  const regex = new RegExp(`.*<${keyType}>(.*)<\/${keyType}>.*`, 'g')
  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]
    if (line.includes(`<key>${keyName}</key>`)) {
      const value = lines[i + 1].replace(regex, '$1')
      return value
    }
  }
  return
}

function testValueFromPlist(filename: string, keyName: string, expectedValue: string, keyType: string = 'string'): void {
  test(`"${keyName}" should be equal to "${expectedValue}"`, () => {
    const actualValue = parsePlist(filename, keyName, keyType)
    expect(actualValue).toEqual(expectedValue)
  })
}

function readPBXBlock(sectionName: string): string {
  const c = config()
  const filename = path.join(c.rootDir, c.ios.projectDir, 'App', 'App.xcodeproj', 'project.pbxproj')
  const lines = fs.readFileLinesSync(filename)
  const result: string[] = []

  const start = lines.indexOf(`/* Begin ${sectionName} section */`)
  const end = lines.indexOf(`/* End ${sectionName} section */`)

  for (let i = start; i < end; i++) {
    result.push(lines[i])
  }

  return result.join('\n')
}

// shows how the runner will run a javascript action with env / stdout protocol
describe('Run the main script', () => {
  // Setup config
  const workdir = process.cwd()
  const appVersion = '9.9.9'
  const buildVersion = '9'
  const configFile = path.join(workdir, 'build.config.json')
  cp.execSync(`jq '
.ios["Info.plist"].CFBundleShortVersionString = "${appVersion}" |
.ios["Info.plist"].CFBundleVersion = "${buildVersion}"
' ${configFile}.template > ${configFile}`)

  const c = config()
  const np = process.execPath
  const ip = path.join(c.rootDir, 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  // Prepare: Create the file for tests
  const projectdir = path.join(c.rootDir, c.ios.projectDir)
  const files = {
    Podfile: resetFile(`${projectdir}/App/Podfile`),
    'Info.plist': resetFile(`${projectdir}/App/App/Info.plist`),
    'AppDelegate.swift': resetFile(`${projectdir}/App/App/AppDelegate.swift`),
    'project.pbxproj': resetFile(`${projectdir}/App/App.xcodeproj/project.pbxproj`),
    'App.entitlements': `${projectdir}/App/App/App.entitlements`
  }

  beforeAll(() => {
    console.log(cp.execFileSync(np, [ip], options).toString())
  })

  // Test: Check if the desired values are in the files
  describe('Info.plist', () => {
    const filename = files['Info.plist']
    testValueFromPlist(filename, 'CFBundleShortVersionString', appVersion)
    testValueFromPlist(filename, 'CFBundleVersion', buildVersion)
  })

  describe('App.entitlements', () => {
    const filename = files['App.entitlements']
    testValueFromPlist(filename, 'aps-environment', 'production')
  })

  describe('Podfile', () => {
    test(`should contains "pod 'Firebase/messaging'"`, () => {
      const data = fs.readFileSync(files.Podfile, 'utf8')
      const start = data.indexOf(`target 'App' do`)
      const end = data.indexOf('end', start)
      const pods = data.substring(start, end)

      expect(pods).toContain(`pod 'Firebase/Messaging'`)
    })
  })

  describe('AppDelegate.swift', () => {
    let fileContent: string
    beforeAll(() => {
      fileContent = fs.readFileSync(files['AppDelegate.swift'], 'utf8')
    })

    test(`should contains "import Firebase"`, () => {
      expect(fileContent).toContain('import Firebase')
    })
    test(`should contains "FirebaseApp.configure()"`, () => {
      expect(fileContent).toContain('FirebaseApp.configure()')
    })
    test(`should contains "didRegisterForRemoteNotificationsWithDeviceToken"`, () => {
      expect(fileContent).toContain('didRegisterForRemoteNotificationsWithDeviceToken')
    })
    test(`should contains "didFailToRegisterForRemoteNotificationsWithError"`, () => {
      expect(fileContent).toContain('didFailToRegisterForRemoteNotificationsWithError')
    })
  })

  describe('project.pbxproj', () => {
    test('should contains "App.entitlement"', () => {
      const expectedValue = 'App.entitlement'
      expect(readPBXBlock('PBXFileReference')).toContain(expectedValue)
      expect(readPBXBlock('PBXGroup')).toContain(expectedValue)
      expect(readPBXBlock('XCBuildConfiguration')).toContain(expectedValue)
    })
    test('should contains "GoogleService-Info.plist"', () => {
      const expectedValue = 'GoogleService-Info.plist'
      expect(readPBXBlock('PBXBuildFile')).toContain(expectedValue)
      expect(readPBXBlock('PBXFileReference')).toContain(expectedValue)
      expect(readPBXBlock('PBXGroup')).toContain(expectedValue)
      expect(readPBXBlock('PBXResourcesBuildPhase')).toContain(expectedValue)
    })
  })
})
