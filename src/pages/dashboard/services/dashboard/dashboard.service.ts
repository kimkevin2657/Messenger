import { Injectable, Injector } from '@angular/core';
import { Extender } from 'src/shared/helpers/extender';
import { ITabView } from 'src/shared/helpers/models';

/**
 * set data for tabs in dashboard
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService extends Extender {
  constructor(protected injector: Injector) {
    super(injector);
  }

  public get views(): ITabView[] {
    return [
      {
        id: 'schedule',
        name: this.translate.instant('dashboard-component.schedule-tab'),
        event: () => {
          this.goto(this.routes.schedule);
        }
      },
      {
        id: 'chart',
        name: this.translate.instant('dashboard-component.charts-tab'),
        event: () => {
          this.goto(this.routes.chart);
        }
      },
      {
        id: 'map',
        name: this.translate.instant('dashboard-component.maps-tab'),
        event: () => {
          this.goto(this.routes.map);
        }
      }
    ];
  }
}
