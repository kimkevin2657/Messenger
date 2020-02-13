import { Component, Injector, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Extender } from 'src/shared/helpers/extender';
import { AuthService } from '../../services/auth/auth.service';

/**
 * get user details from user and sign them up to firebase.
 * once signed up, send verification email to the users email.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends Extender {
  public model: {
    displayName: string;
    email: string;
    password: string;
    rpassword: string;
  } = {
    displayName: null,
    email: '',
    password: '',
    rpassword: null
  };
  public passwordStrength: string;
  @ViewChild('form', null) private form: NgForm;

  constructor(protected injector: Injector, private authService: AuthService) {
    super(injector);
  }

  /** collect user basic info and sign up user to app using firebase auth */
  public signup(): void {
    if (this.form.valid) {
      this.loading = true;
      this.authService
        .signUp(this.model)
        .then(this.successPromise)
        .catch((err) => this.failPromise(err));
    } else {
      this.toast(this.translate.instant('form-validation-messages.form-incomplete'));
    }
  }

  /** send verification email to the users email and navigate to verify page */
  private successPromise = () => {
    this.loading = false;
    this.authService.sendEmailVerification();
    this.goto(this.routes.verifyEmail);
  };

  private failPromise = (err: any) => {
    this.loading = false;
    this.toast(err);
  };
}
