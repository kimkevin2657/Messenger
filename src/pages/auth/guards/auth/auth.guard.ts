import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Extender } from 'src/shared/helpers/extender';
import { IUser } from '../../helpers/model';
import { AuthService } from '../../services/auth/auth.service';

/**
 * check if user is logged in or not
 * if not, route to login page. if user is logged in but account deactivated, route to deactivated account page
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard extends Extender implements CanActivate {
  public user: IUser;

  constructor(protected injector: Injector, private auth: AuthService) {
    super(injector);
  }

  /** check if user is logged in or not if not, route to login page.
   * if user is logged in but account deactivated, route to deactivated account page
   */
  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.user.pipe(
      take(1),
      map((user) => {
        this.user = user;
        return !!user;
      }),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.goto(this.routes.login);
        }
        if (this.user.deactivated) {
          this.goto(this.routes.deactivated);
        }
        if (!this.auth.emailVerified) {
          this.goto(this.routes.verifyEmail);
        }
      })
    );
  }
}
