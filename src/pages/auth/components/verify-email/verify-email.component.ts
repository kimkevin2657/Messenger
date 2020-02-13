import { Component, Injector, OnInit } from '@angular/core';
import { Extender } from 'src/shared/helpers/extender';
import { IUser } from '../../helpers/model';
import { AuthService } from '../../services/auth/auth.service';

/**
 * users are redirected to verify page if they do not have their emails verified
 * here they can resend a verification code or go back to login page
 */
@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent extends Extender implements OnInit {
  public currentUser: IUser;

  constructor(protected injector: Injector, private authService: AuthService) {
    super(injector);
  }

  /** get current user on component init */
  public async ngOnInit() {
    this.currentUser = await this.authService.getUser();
  }

  /** send verification email to users email address */
  public async resendVerificationEmail() {
    await this.authService.sendEmailVerification();
    this.toast(this.translate.instant('verify-email-component.verification-email-sent'));
  }

  /** go back to login page and sign out the user from the app */
  public back() {
    this.authService.signOut().then(() => {
      this.goto(this.routes.login);
    });
  }
}
