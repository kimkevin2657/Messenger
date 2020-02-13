import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { MessageComponent } from './components/message/message.component';
import { MessagesComponent } from './components/messages/messages.component';

@NgModule({
  declarations: [MessagesComponent, MessageComponent],
  entryComponents: [MessageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: MessagesComponent
      },
      {
        path: ':id',
        component: MessagesComponent
      }
    ])
  ]
})
export class MessagesModule { }
