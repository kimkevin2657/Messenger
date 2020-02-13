import { Component, Injector } from '@angular/core';
import { Extender } from 'src/shared/helpers/extender';
import { TermsAndConditionsComponent } from 'src/shared/modals/terms-and-conditions/terms-and-conditions.component';
import { SocialAuthProvider } from '../../helpers/constants';
import { AuthService } from '../../services/auth/auth.service';

/**
 * navigate to login or use social login, access to terms and conditions modal
 */
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends Extender {
  /** stores enum of social providers */
  public provider = SocialAuthProvider;

  /** loader for facebook button in template */
  public fbLoading: boolean = false;

  /** loader for facebook button in template */
  public gplusLoading: boolean = false;

  constructor(protected injector: Injector, private authService: AuthService) {
    super(injector);
  }

  /** users facebook or google social to login based on provider type
   * on success, navigate to dashboard page
   */
  public socialLogin(provider: number): void {
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

  /** open terms and conditions modal */
  public async openTermsAndConditions() {
    const modal = await this.openModal(TermsAndConditionsComponent);
    modal.present();
  }

  /** common success promise callback */
  private successPromise = () => {
    this.loading = false;
    this.fbLoading = false;
    this.gplusLoading = false;
    this.goto(this.routes.dashboard);
  };

  /** common failed promise callback */
  private failPromise = (err: any) => {
    this.fbLoading = false;
    this.gplusLoading = false;
    this.loading = false;
    this.toast(err);
  };
}
