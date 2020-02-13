import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/shared/shared.module';
import { ChartsComponent } from './components/charts/charts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MapsComponent } from './components/maps/maps.component';
import { ScheduleComponent } from './components/schedule/schedule.component';

@NgModule({
  declarations: [DashboardComponent, ScheduleComponent, MapsComponent, ChartsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        children: [
          {
            path: '',
            redirectTo: 'schedule',
            pathMatch: 'full',
          },
          {
            data: { page: 'chart' },
            path: 'chart',
            component: ChartsComponent,
          },
          {
            data: { page: 'map' },
            path: 'map',
            component: MapsComponent,
          },
          {
            data: { page: 'schedule' },
            path: 'schedule',
            component: ScheduleComponent,
          },
        ],
        path: '',
        component: DashboardComponent,
      },
    ]),
  ],
})
export class DashboardModule { }
