# Ionic Full Starter App

A beautifully designed ionic 4 and angular 8 app template with a lot of functionality to allow a user/ developer to get started quickly in their app development from this template.

The app is developed with Angular and Ionic for front facing app and Firebase as backend, managing everything from database and persistence to storage, cloud messaging and hosting.

The app is compatible with web and native applications. The native functionality used in this app also has a full functioning web counterpart.

---

## Documentation

Get full app documentation [here](https://drive.google.com/open?id=1_fz594jCqT2HHSJzALE_o_bpdu3JROSF)

1. Unzip documentation.zip file
2. open index.html with browser by double clicking or right click and open with browser of choice.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Ionic, Environment and System Info](#ionic-environment-and-system-info)
- [Firebase Setup](#firebase-setup)
  - [Pre Requisites](#pre-requisites)
  - [Create a Firebase Project](#create-a-firebase-project)
  - [Register your app with Firebase](#register-your-app-with-firebase)
  - [Setup Authentication](#setup-firebase-authentication)
  - [Setup Database](#setup-firebase-database)
  - [Setup Storage](#setup-firebase-storage)
  - [Functions & Cloud Messaging Function](#firebase-functions-&-cloud-messaging-function)
  - [Conclude](#firebase-conclude)
- [App Preview](#app-preview)
- [Deploying](#deploying)
  - [Progressive Web App](#progressive-web-app)
  - [Android](#android)
  - [iOS](#ios)

---

## Getting Started

- [Download the installer](https://nodejs.org/) for Node.js 6 or greater.
- Install the ionic CLI globally: `npm install -g ionic`
- Get the project file you downloaded after purchase **FULL_STARTER_APP**.
- Unzip and navigate to the folder in terminal for mac or console for windows `cd FULL_STARTER_APP`
- Please note that before running the app, you need to configure your own firebase project and update firebase property in `src/environments/environment.ts`. See **[Firebase Setup](#firebase-setup)** for guidance into settings up firebase
- Run `npm install` from the project root.
- Run `ionic serve` in a terminal from the project root.

---

## Ionic, Environment and System Info

### Ionic:

- Ionic CLI : 5.4.6 (/usr/local/lib/node_modules/ionic)
- Ionic Framework : @ionic/angular 4.11.5
- @angular-devkit/build-angular : 0.801.3
- @angular-devkit/schematics : 8.1.3
- @angular/cli : 8.1.3
- @ionic/angular-toolkit : 2.0.0

### Cordova:

- Cordova CLI : 9.0.0 (cordova-lib@9.0.1)
- Cordova Platforms : android 8.1.0
- Cordova Plugins :
  - call-number
  - cordova-plugin-androidx
  - cordova-plugin-androidx-adapter
  - cordova-plugin-camera
  - cordova-plugin-device
  - cordova-plugin-facebook4
  - cordova-plugin-firebasex
  - cordova-plugin-geolocation
  - cordova-plugin-googleplus
  - cordova-plugin-ionic-keyboard
  - cordova-plugin-ionic-webview
  - cordova-plugin-splashscreen
  - cordova-plugin-statusbar
  - cordova-plugin-telerik-imagepicker
  - cordova-plugin-whitelist
  - cordova-plugin-x-socialsharing
  - cordova-sqlite-storage

### Utility:

- cordova-res : 0.8.1
- native-run : 0.2.9

### System:

- ios-sim : 8.0.2
- NodeJS : v12.13.0 (/usr/local/bin/node)
- npm : 6.12.0
- OS : macOS Catalina
- Xcode : Xcode 11.2.1 Build version 11B500

---

## Firebase Setup

### Pre-requisites

1. You need to have a Google account and sign to the **[Firebase Console](https://console.firebase.google.com/u/0/)**. You can skips steps as required.
2. For native, you need to change the **widget id** attribute in **config.xml** to a custom app ID `<widget id="com.ezyapps.fullstarter"...`. any unique ID will do find out about app ID formats online.

### Create a Firebase Project

**See firebase web setup for more info [here](https://firebase.google.com/docs/web/setup)**

1. In the Firebase console, click **Add project**, then select or enter a **Project name**.

2. (Optional) If you created a new project, you can edit the Project ID but you can change it.

3. Click Continue.

4. Click Create project (or Add Firebase, if you're using an existing GCP project).

### Register your app with Firebase

In this project we are using firebase web, ios and android apps. Below are points on how to set them all up.

#### Web app

After you have a Firebase project, you can add your web app to it.

1. In the center of the Firebase console's project overview page, click the **Web** icon (**</>**) to launch the setup workflow.

2. Enter your app's nickname. This nickname is an internal, convenience identifier and is only visible to you in the Firebase console.

3. Set up Firebase Hosting for your web app. This is optional is you want to be able to deploy a web version of the app.
   - You can set up Firebase Hosting now or later. You can also link your Firebase Web App to a Hosting site at any time in your Project settings.
   - If you choose to set up Hosting up now, select a site from the dropdown list to link to your Firebase Web App.
4. Click **Register app**.
5. In **Project Settings** page, locate the config for the new created Web App. The config settings should look like this.
   ```json
   const firebaseConfig = {
     apiKey: "AIsdfsadfgasgjGiojJkHGuHgaweFoLy-EFd",
     authDomain: "my-first-firebase-app.firebaseapp.com",
     databaseURL: "https://my-first-firebase-app.firebaseio.com",
     projectId: "my-first-firebase-app",
     messagingSenderId: "12345678910",
     appId: "1:12345678910:web:10987654321"
   };
   ```
6. Copy the config and paste in `src/environments/environment.ts`.
   - notice there is a **hosting** property in **environment.ts**. Copy the url for the site you will be hosting and assign to the hosting property
   - or leave blank. removing will cause some runtime errors unless you remove reference **/src/shared/modals/social-share.component.ts**
7. Note that if you are hosting your site, change the app name in `.firebaserc` to your own firebase project

#### iOS App Config

1. Install CocoaPods. See how [here](https://stackoverflow.com/questions/41064579/pod-init-giving-error-bash-pod-command-not-found)
2. Got to **Project Settings** and click **Add app** in **Your apps** panel to display the platform options.
3. Select the iOS **(iOS)** icon to open register iOS App page.
4. Enter your app's bundle ID in the iOS bundle ID field, Bundle ID can be found in widget id attribute in **config.xml** file in ionic project.
5. Click Register app.
6. Download config file **(GoogleService-Info.plist)** and copy in the root of ionic app project.
7. Thats all, no need for any further steps, just follow through the follow and close the popup.

#### Android App Config

1. Got to **Project Settings** and click **Add app** in **Your apps** panel to display the platform options.
2. Select the android **(android_icon)** icon to open register Android App page.
3. Enter your app's Android package name. Android package name can be found in widget id attribute in **config.xml** file in ionic project.
4. Enter Debug signing certificate [SHA-1](https://developers.google.com/android/guides/client-auth): A SHA-1 hash is required by Firebase Authentication (when using Google Sign In or phone number sign in) and Firebase Dynamic Links.
5. Click Register app.
6. Download config file **(google-services.json)** and copy in the root of ionic app project.
7. Thats all, no need for any further steps, just follow through the follow and close the popup.

### Setup Firebase Authentication

1. Access authentication page via Authentication link in left menu.
2. Select **Sign-in method** tab.
3. Enable Providers (This app uses Email/Password, Google and Facebook)
   - Facebook Instructions
     - On the Facebook for Developers site, get the App ID and an App Secret for your app.
     - Enable Facebook Login:
       - In the Firebase console, open the Auth section.
       - On the Sign in method tab, enable the Facebook sign-in method and specify the App ID and App Secret you got from Facebook.
       - Then, make sure your OAuth redirect URI (e.g. my-app-12345.firebaseapp.com/\_\_/auth/handler) is listed as one of your OAuth redirect URIs in your Facebook app's settings page on the Facebook for Developers site in the Product Settings > Facebook Login config.
   - Google Instructions
     - enable Google
     - copy **Web client ID** in **Web SDK configuration** dropdown and paste in **googleClientId** property in `src/environments/environment.ts`

### Setup Firebase Database

1. Access Database page via Database link in left menu.
2. Then click **Create database for Cloud Firestore**.
3. Select Locked Mode for Cloud Firestore Security Rules.
4. Once complete, click on the **Rules** tab and copy in the following code

   ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {

         match /fcm-devices/{id} {
           allow read, write;
         }

         match /users/{userId} {
           allow read: if isSignIn();
           allow write: if isOwner(userId);
         }

         match /files/{id} {
           allow read, write: if isSignIn();
         }

         match /messages/{id} {
           allow read, write: if isSignIn();
         }

         match /friends/{id} {
           allow read, write: if isSignIn();
         }

         match /feed/{id} {
           allow read, write: if isSignIn();
         }

         match /feedback/{id} {
           allow read, write: if isSignIn();
         }

         match /feed/{id}/comments/{cid} {
           allow read, write: if isSignIn();
         }

         match /events/{id} {
           allow read, write: if isSignIn();
         }

         match /preferences/{id} {
           allow read, write: if isSignIn();
         }

         /// Functions ///

         function getUserData(){
         return get(/databases/$(database)/documents/users/$(request.auth.uid));
         }

         function existingData(){
           return resource.data;
         }

         function incomingData(){
           return request.resource.data;
         }
         function emailVerified(){
           return request.auth.token.email_verified;
         }

         function isOwner(userId){
           return request.auth.uid == userId
         }

         function isSignIn(){
           return request.auth != null
         }
       }
     }
   ```

### Setup Firebase Storage

1. Setup Storage by selecting the Storage link in the left menu under develop and Click **Get Started**.
2. Click Next and Select a cloud storage location and then click Done button.
3. Note that a new param for **storageBucket** will be added to firebaseConfig.
4. Go to Project Settings and under the apps you created before, select the web app you created
5. Select CDN or Config and copy the **storageBucket** property and data.
6. Paste in `src/environments/environment.ts`.
7. Final config in environments file should look like this
   ```json
   const firebaseConfig = {
    apiKey: "AIsdfsadfgasgjGiojJkHGuHgaweFoLy-EFd",
    authDomain: "my-first-firebase-app.firebaseapp.com",
    databaseURL: "https://my-first-firebase-app.firebaseio.com",
    projectId: "my-first-firebase-app",
    storageBucket: "my-first-firebase-app.appspot.com",
    messagingSenderId: "12345678910",
    appId: "1:12345678910:web:10987654321"
   };
   ```

### Firebase Functions & Cloud Messaging Function

The app uses firebase cloud messaging to send push notifications to users when a user send a message. this is configure via firebase functions. More information about cloud functions available [here](https://firebase.google.com/docs/functions?authuser=1).
To setup firebase functions, you need firebase tools. the following are steps to setup.

1. Install firebase-tools `npm install -g firebase-tools`
2. Run firebase login to log in via the browser and authenticate the firebase tool
3. (This project already has functions setup so no need to run this setup)
   - Go to your ionic project directory and run `firebase init` and select what features want to add.
4. check out the functions folder. In `src/index.ts` there is a function that will run a check on the messages collection after every update, get the recipients details for the message and forward a push notification to their device. (More details in code)
5. Run `firebase deploy --only functions` to deploy any changes to functions you might make. Tutorial is also available [here](https://www.freecodecamp.org/news/how-to-get-push-notifications-working-with-ionic-4-and-firebase-ad87cc92394e/) if you get stuck.

### Firebase Conclude

All settings should be completed at this stage and the app will run with `ionic serve`. Note that you will have empty data. No data is pre-populated. Enjoy!

---

## Deploying

### Progressive Web App

1. Setup firebase hosting. See **Hosting** heading in firebase setup documentation here https://docs.google.com/document/d/14kijUdUQqDisDrEXx-8_WOnnz78MciXLFTh0MgdbHYs/edit?usp=sharing
2. Run `npm run deploy`. This will build the app and push content of www folder firebase hosting server

### Android

Setup your machine to build android apps. [Find out here](https://ionicframework.com/docs/installation/android)

1. To emulate, run `npm run android-emulate`
2. To emulate with livereload and consolelogs, run `npm run android-emulate-live`
3. To run on device, run `npm run android-device`
4. To run on device with livereload and consolelogs, run `npm run android-device-live`

### iOS

Setup your machine to build ios apps (mac only). [Find out here](https://ionicframework.com/docs/installation/ios)

1. To emulate, run `npm run ios-emulate`
2. To emulate with livereload and consolelogs, run `npm run ios-emulate-live`
3. To run on device, run `npm run ios-device`
4. To run on device with livereload and consolelogs, run `npm run ios-device-live`

## Issues & Resources

[Password Reset tutorial](https://medium.com/@c_innovative/implementing-password-reset-can-be-a-tricky-but-inevitable-task-737badfb7bab)

[Generate android debug keystore](https://stackoverflow.com/questions/8576732/there-is-no-debug-keystore-in-android-folder)

Google Login CocoaPods issue fix

- https://github.com/CocoaPods/CocoaPods/issues/6223#issuecomment-262277995
- https://stackoverflow.com/questions/41064579/pod-init-giving-error-bash-pod-command-not-found

[Push notifications ios tutorial](https://www.raywenderlich.com/8164-push-notifications-tutorial-getting-started)

[HammerJs Touch Gestures Setup](https://medium.com/madewithply/ionic-4-long-press-gestures-96cf1e44098b)

[Compodoc issue generating document](https://github.com/compodoc/compodoc/issues/874)
