import { Component, Injector, OnInit } from '@angular/core';
import { Extender } from 'src/shared/helpers/extender';
import { FirestoreService } from 'src/shared/services/firestore/firestore.service';
import { IUser } from '../../helpers/model';
import { AuthService } from '../../services/auth/auth.service';

/**
 * this page is shown when a user deactivate their account.
 * user account deactivation is just a boolean in user document that can be toggled in settings
 * every time a user logs in the user is redirected to this page using the auth guard
 * if they have deactivated their account
 */
@Component({
  selector: 'app-deactivated-account',
  templateUrl: './deactivated-account.component.html',
  styleUrls: ['./deactivated-account.component.scss']
})
export class DeactivatedAccountComponent extends Extender implements OnInit {
  public currentUser: IUser;

  constructor(protected injector: Injector, private authService: AuthService, private firestoreService: FirestoreService) {
    super(injector);
  }

  /** get current user */
  public async ngOnInit() {
    this.currentUser = await this.authService.getUser();
  }

  /** reactivate a user account, sign out user and navigate to login page */
  public async reactivate() {
    const user = await this.authService.getUser();
    this.loading = true;
    user.deactivated = false;
    this.firestoreService
      .update(`users/${user.uid}`, user)
      .then(() => {
        this.loading = false;
        this.authService.signOut();
        this.goto(this.routes.login);
        this.toast(this.translate.instant('deactivated-account-component.reactivated-success-message'));
      })
      .catch((err) => this.toast(err));
  }
}
