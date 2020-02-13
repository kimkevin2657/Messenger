import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { PeopleComponent } from './components/people/people.component';
import { PersonComponent } from './components/person/person.component';

@NgModule({
  declarations: [PeopleComponent, PersonComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: PeopleComponent,
      },
      {
        path: ':id',
        component: PersonComponent,
      },
    ]),
  ],
})
export class PeopleModule {}
