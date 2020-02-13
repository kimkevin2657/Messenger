import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Extender } from 'src/shared/helpers/extender';
import { AuthService } from '../../services/auth/auth.service';

/**
 * allows user to update their password
 * send a one time token to users email so that they can reset their password using firebase auth,
 * when user clicks the link in their email, they are redirected to this component with code in query params
 * check query-params and send code as well as new user password to change user password
 */
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent extends Extender implements OnInit {
  public isPasswordReset: boolean = false;
  public hasRequested: boolean = false;
  public passwordStrength: string;
  public model: {
    code?: string;
    email?: string;
    password: string;
    rpassword?: string;
  } = { code: null, email: null, password: null, rpassword: null };
  @ViewChild('emailForm', null) private emailForm: NgForm;
  @ViewChild('passwordForm', null) private passwordForm: NgForm;

  constructor(protected injector: Injector, private authService: AuthService) {
    super(injector);
  }

  /** subscribe to query param changes,
   * if the param oobCode, provided by firebase is included set isPassword reset property to true
   * store oobCode value in model property. the email route configurations are done in
   * https://console.firebase.google.com/u/1/project/complete-fire-starter/authentication/emails
   */
  public ngOnInit() {
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((param) => {
        if (param && param.mode === 'resetPassword' && param.oobCode) {
          this.model.code = param.oobCode;
          this.isPasswordReset = true;
        }
      })
    );
  }

  /** allow firebase to send a password reset token to the users provided email */
  public requestReset() {
    this.loading = true;
    if (this.emailForm.valid) {
      this.authService
        .sendPasswordReset(this.model.email)
        .then(() => {
          this.loading = false;
          this.hasRequested = true;
        })
        .catch((err) => this.failPromise(err));
    }
  }

  /** allow firebase to handle password change by providing new and retype new password */
  public resetPassword() {
    this.loading = true;
    if (this.passwordForm.valid) {
      this.authService
        .confirmPasswordReset(this.model.code, this.model.password)
        .then(() => {
          this.loading = false;
          this.toast(this.translate.instant('forgot-component.reset-success'));
          this.goto(this.routes.login);
        })
        .catch((err) => this.failPromise(err));
    }
  }

  private failPromise = (err: any) => {
    this.loading = false;
    this.toast(err);
  };
}
