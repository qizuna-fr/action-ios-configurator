import * as appEntitlements from './includes/app-entitlements'
import * as pbxproj from './includes/pbxproj'
import * as firebase from './firebase'

export async function addPushNotifications(): Promise<void> {
  const capabilities = {
    pushNotification: {
      id: '5CDC942327E9FF08000D304C',
      PBXFileReference: `/* App.entitlements */ = {isa = PBXFileReference; lastKnownFileType = text.plist.entitlements; path = App.entitlements; sourceTree = "<group>"; };`,
      PBXAppChild: '/* App.entitlements */,',
      CODE_SIGN_ENTITLEMENTS: 'App/App.entitlements;'
    },
    'GoogleService-Info': {
      id: '5CDC942727EB2EC5000D304C',
      PBXBuild: {
        id: '5CDC942827EB2EC5000D304C',
        PBXBuildFile: `/* GoogleService-Info.plist in Resources */ = {isa = PBXBuildFile; fileRef = 5CDC942727EB2EC5000D304C /* GoogleService-Info.plist */; };`,
        PBXResourcesBuildPhase: '/* GoogleService-Info.plist in Resources */,'
      },

      PBXFileReference: `/* GoogleService-Info.plist */ = {isa = PBXFileReference; fileEncoding = 4; lastKnownFileType = text.plist.xml; path = "GoogleService-Info.plist"; sourceTree = "<group>"; };`,
      PBXAppChild: '/* GoogleService-Info.plist */,'
    }
  }

  const idDebug = pbxproj.getBuildConfigurationId('Debug')
  const idRelease = pbxproj.getBuildConfigurationId('Release')

  const pushNotification = capabilities.pushNotification
  const setting = 'CODE_SIGN_ENTITLEMENTS'
  pbxproj.addBuildSetting(idDebug, 'Debug', setting, pushNotification[setting])
  pbxproj.addBuildSetting(idRelease, 'Release', setting, pushNotification[setting])
  pbxproj.addFileToPBXGroup(pushNotification.id, pushNotification.PBXAppChild)
  pbxproj.addPBXFileReference(pushNotification.id, pushNotification.PBXFileReference)

  appEntitlements.addCapability({'aps-environment': 'production'})

  /* Firebase */
  firebase.addPod()
  firebase.addFunctionsToAppDelegate()

  const GoogleServices = capabilities['GoogleService-Info']
  pbxproj.addPBXBuildFile(GoogleServices.PBXBuild.id, GoogleServices.PBXBuild.PBXBuildFile)
  pbxproj.addPBXResourcesBuildPhase(GoogleServices.PBXBuild.id, GoogleServices.PBXBuild.PBXResourcesBuildPhase)
  pbxproj.addFileToPBXGroup(GoogleServices.id, GoogleServices.PBXAppChild)
  pbxproj.addPBXFileReference(GoogleServices.id, GoogleServices.PBXFileReference)
}
