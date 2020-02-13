import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Extender } from 'src/shared/helpers/extender';
import { IUser } from '../../helpers/model';
import { AuthService } from '../../services/auth/auth.service';

/**
 * check if user is verified, if they are verified, got to dashboard
 * else stay on verified page
 */
@Injectable({
  providedIn: 'root'
})
export class VerifyEmailGuard extends Extender implements CanActivate {
  public user: IUser;
  constructor(protected injector: Injector, private auth: AuthService) {
    super(injector);
  }
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.user.pipe(
      take(1),
      map((user) => {
        if (!!user && this.auth.emailVerified) {
          this.goto(this.routes.dashboard);
        }
        return true;
      })
    );
  }
}
