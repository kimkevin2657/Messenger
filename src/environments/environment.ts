// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * environment settings info
 * the firebase.hosting param is not from firebase, it is custom for wherever your ionic app is hosted and used by share functionality within the app for browsers.
 */
export const environment = {
  production: false,
  hosting: 'http://localhost:8100',
  googleClientId: '807755525390-6rq3nfl2o3emt2d0kp3se8aurh11u988.apps.googleusercontent.com',
  firebaseConfig: {
    apiKey: "AIzaSyCtK1hdOlykB2mMecbT3Rf7Vt7_HH0nvTY",
    authDomain: "messagerapp-37cb6.firebaseapp.com",
    databaseURL: "https://messagerapp-37cb6.firebaseio.com",
    projectId: "messagerapp-37cb6",
    storageBucket: "messagerapp-37cb6.appspot.com",
    messagingSenderId: "807755525390",
    appId: "1:807755525390:web:228bd650fc694b330d3b5f",
    measurementId: "G-TF24RZW3GX"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
