# IOS AppDelegate.swift Editor

<a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>


Use this action to configure a fresh iOS project created with the command `npx cap add ios`.

This action will do the following changes :

- Set the options in the Info.plist (app version, build version, permissions, ...).
- Add the "Push Notifications" capability.
- Add and declare the "Firebase/messaging" pod.
- Reference the `GoogleService-Info.plist` in the project.

## How to use

```yaml
# ...
jobs:
  # ...
  steps:
    # ...
    - uses: qizuna-fr/action-ios-configurator@v1
```

## Configuration file

This action needs a `"build.config.json"` in the root directory of your project, with the following structure :

```json
{
  "ios": {
    "projectDir": "ios/",
    "Info.plist": {
      "CFBundleShortVersionString": "1.0",
      "CFBundleVersion": 1,
      "ITSAppUsesNonExemptEncryption": false,
      "NSLocationWhenInUseUsageDescription": "Write description here",
      "NSCameraUsageDescription": "Write description here",
      "NSPhotoLibraryAddUsageDescription":"Write description here",
      "NSPhotoLibraryUsageDescription": "Write description here",
      "LSApplicationQueriesSchemes": ["mailto"]
    }
  }
}
```

| Property | Description |
| :--- | :--- |
| `projectDir` | The folder where your project is (eg: `"ios/"` or `"."`)<br>*Note: the trailing slash is not mandatory*
| `Info.plist` | A JSON Object with the properties you want to insert (with their values) in the Info.plist file (eg: `"CFBundleShortVersionString"`)<br>*Note: these properties will overwrite those already in the file*


*Copyright (c) 2022 Qizuna*
