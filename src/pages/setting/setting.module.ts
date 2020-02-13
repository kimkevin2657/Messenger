import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { SettingComponent } from './components/setting/setting.component';

@NgModule({
  declarations: [SettingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingComponent
      }
    ])
  ]
})
export class SettingModule { }
