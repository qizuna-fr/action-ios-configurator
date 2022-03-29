import * as appDelegate from './includes/appdelegate-swift'
import * as podfile from './includes/podfile'

export async function addPod(): Promise<void> {
  podfile.addPod('Firebase/Messaging')
}

export async function addFunctionsToAppDelegate(): Promise<void> {
  appDelegate.addImport('Firebase')
  appDelegate.addLinesToFunction('didFinishLaunchingWithOptions', '        FirebaseApp.configure()')
  appDelegate.addFunctionToMain(`    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
        Messaging.messaging().token(completion: { (token, error) in
            if let error = error {
                NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
            } else if let token = token {
                NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: token)
            }
        })
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
    }
`)
}
