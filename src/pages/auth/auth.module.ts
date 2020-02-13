import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { AuthComponent } from './components/auth/auth.component';
import { DeactivatedAccountComponent } from './components/deactivated-account/deactivated-account.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { VerifyEmailGuard } from './guards/verify-email/verify-email.guard';

@NgModule({
  declarations: [AuthComponent, LoginComponent, RegisterComponent, ForgotComponent, VerifyEmailComponent, DeactivatedAccountComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'forgot',
        component: ForgotComponent
      },
      {
        path: 'deactivated',
        component: DeactivatedAccountComponent
      },
      {
        canActivate: [VerifyEmailGuard],
        path: 'verify-email',
        component: VerifyEmailComponent
      }
    ])
  ]
})
export class AuthModule {}
