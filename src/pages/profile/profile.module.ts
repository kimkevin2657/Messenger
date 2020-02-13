import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import { UserPeopleComponent } from './components/user-people/user-people.component';
import { UserPostsComponent } from './components/user-posts/user-posts.component';

@NgModule({
  declarations: [ProfileComponent, UserPostsComponent, UserPeopleComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
      },
    ]),
  ],
})
export class ProfileModule { }
