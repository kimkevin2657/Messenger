import { Injectable, Injector } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { first, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Extender } from 'src/shared/helpers/extender';
import { FirestoreService } from 'src/shared/services/firestore/firestore.service';
import { SocialAuthProvider } from '../../helpers/constants';
import { IUser } from '../../helpers/model';

/**
 * firebase authentication methods are handled by this service
 * email handlers https://firebase.google.com/docs/auth/custom-email-handler
 * authentication tutorial https://www.positronx.io/full-angular-7-firebase-authentication-system/
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends Extender {
  public user: Observable<IUser>;

  constructor(
    protected injector: Injector,
    private afAuth: AngularFireAuth,
    private gplus: GooglePlus,
    private facebook: Facebook,
    private firestoreService: FirestoreService
  ) {
    super(injector);

    /** watch auth state if user is logged in, get user info from users list as observable else return observable null */
    this.user = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestoreService.doc$<IUser>(`users/${user.uid}`);
        } else {
          return of(null);
        }
      })
    );
  }

  /** get user and return as a promise to access easily in components using async and await */
  public getUser() {
    return this.user.pipe(first()).toPromise();
  }

  /** sign in user with email and password using firebase library */
  public async signIn({ email, password }) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  /** sign up user to firebase and update user details */
  public async signUp({ displayName, email, password }) {
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    await credential.user.updateProfile({ displayName, photoURL: null });
    return this.updateUserData(credential.user);
  }

  /** send email verification to authenticated user */
  public async sendEmailVerification() {
    return await this.afAuth.auth.currentUser.sendEmailVerification();
  }

  /** use by email verification to apply verification code and set user emailVerified property to true */
  public async applyActionCode(code: string) {
    return await this.afAuth.auth.applyActionCode(code);
  }

  /** update user email in auth and in users list */
  public async updateEmail(email: string) {
    const user = await this.getUser();
    user.email = email;
    await this.firestoreService.set<IUser>(`users/${user.uid}`, user);
    return await firebase.auth().currentUser.updateEmail(email);
  }

  /** update user password */
  public async updatePassword(oldPassword: string, password: string) {
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email, oldPassword);
    return user.reauthenticateAndRetrieveDataWithCredential(credential).then(() => {
      return firebase.auth().currentUser.updatePassword(password);
    });
  }

  /** send password reset email */
  public async sendPasswordReset(email: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(email);
  }

  /** get user emailVerified property */
  public get emailVerified() {
    return this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.emailVerified;
  }

  /** confirm password reset with code from email verification and password */
  public async confirmPasswordReset(code: string, password: string) {
    return await this.afAuth.auth.confirmPasswordReset(code, password);
  }

  /** select type of social login, either facebook or google, use native login with cordova plugins if on device or web login
   * on browser. on complete update user details
   */
  public async socialogin(providerType: number) {
    let credential: { user: { uid: any; email: any; displayName: any; photoURL: any } };
    if ((window as any).cordova) {
      credential = await this.nativeLogin(providerType);
    } else {
      credential = await this.webLogin(providerType);
    }
    return await this.updateUserData(credential.user);
  }

  /** sign out of the app and after sign out destroy all subscriptions to avoid missing permissions error */
  public async signOut() {
    return await this.afAuth.auth.signOut().then(() => {
      // this.forceSubscriptionDestroy();
    });
  }

  /** update user details in users list */
  private updateUserData({ uid, email, displayName, photoURL }) {
    const data = {
      uid,
      email,
      displayName,
      photoURL
    };
    return this.firestoreService.set<IUser>(`users/${uid}`, data);
  }

  /** do a native login with cordova plugins for google or facebook,
   * specify by providerType with is an enum of providers
   * get token from successful native login and use with firebase library to login with token.
   */
  private async nativeLogin(providerType: number): Promise<any> {
    let cred: { idToken?: string; authResponse: { accessToken: string } };
    if (providerType === SocialAuthProvider.google) {
      cred = await this.gplus.login({
        webClientId: environment.googleClientId,
        offline: true,
        scopes: 'profile email'
      });

      return this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(cred.idToken));
    } else {
      cred = await this.facebook.login(['public_profile']);

      return this.afAuth.auth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(cred.authResponse.accessToken));
    }
  }

  /** do web login for third party providers, specify providerType */
  private async webLogin(providerType: number): Promise<any> {
    let provider: firebase.auth.GoogleAuthProvider | firebase.auth.FacebookAuthProvider | firebase.auth.AuthProvider;
    if (providerType === SocialAuthProvider.google) {
      provider = new firebase.auth.GoogleAuthProvider();
    } else {
      provider = new firebase.auth.FacebookAuthProvider();
    }
    return await this.afAuth.auth.signInWithPopup(provider);
  }
}
