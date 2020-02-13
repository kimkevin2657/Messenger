import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Extender } from 'src/shared/helpers/extender';
import { SocialAuthProvider } from '../../helpers/constants';
import { AuthService } from '../../services/auth/auth.service';

/**
 * handle user authentication via email and also social login
 * access forgot password and register pages
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Extender implements OnInit {
  public provider = SocialAuthProvider;
  public fbLoading: boolean = false;
  public gplusLoading: boolean = false;
  public emailVerified: string;
  public model: { email: string; password: string } = {
    email: 'hello@ezyapps.co.uk',
    password: 'password123'
  };
  public rememberMe: boolean = false;
  @ViewChild('form', null) private form: NgForm;

  constructor(protected injector: Injector, private authService: AuthService, private storage: Storage) {
    super(injector);
  }

  /** get username from storage if available,
   * set remember me property is user name available,
   * set email property with username
   */
  public async ngOnInit() {
    const username = await this.storage.get('username');
    this.rememberMe = username ? true : false;
    this.model.email = username ? username : this.model.email;
    this.activatedRoute.queryParams.subscribe((param) => {
      if (param && param.emailVerified) {
        this.emailVerified = param.emailVerified;
      }
    });
  }

  /** if remember me checkbox ticked, save username. if unticked, remove username */
  public doRememberMe() {
    if (this.rememberMe && this.model.email) {
      this.storage.set('username', this.model.email);
      return;
    }
    this.storage.remove('username');
  }

  /** login user, handle remember me and route to dashboard when complete */
  public login(): void {
    if (!this.model.email) {
      return;
    }
    if (this.form.valid) {
      this.loading = true;
      this.doRememberMe();
      this.authService
        .signIn(this.model)
        .then(this.successPromise)
        .catch((err) => this.failPromise(err));
    } else {
      this.toast(this.translate.instant('form-validation-messages.form-incomplete'));
    }
  }

  /** users facebook or google social to login based on provider type
   * on success, navigate to dashboard page
   */
  public socialLoginIn(provider: number) {
    if (provider === this.provider.google) {
      this.gplusLoading = true;
    } else {
      this.fbLoading = true;
    }
    this.authService
      .socialogin(provider)
      .then(this.successPromise)
      .catch((err) => this.failPromise(err));
  }

  private successPromise = () => {
    this.loading = false;
    this.fbLoading = false;
    this.gplusLoading = false;
    this.goto(this.routes.dashboard);
  };

  private failPromise = (err: any) => {
    this.fbLoading = false;
    this.gplusLoading = false;
    this.loading = false;
    this.toast(err);
  };
}
