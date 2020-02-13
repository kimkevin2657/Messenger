/**
 * native add ons all in one place
 * export to appModule Providers
 */
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

export const NativeImports = [
  StatusBar,
  SplashScreen,
  Facebook,
  GooglePlus,
  FirebaseX,
  Camera,
  CallNumber,
  ImagePicker,
  Geolocation,
  SocialSharing
];
