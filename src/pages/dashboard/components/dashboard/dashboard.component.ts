import { Component, Injector } from '@angular/core';
import { Extender } from 'src/shared/helpers/extender';
import { ITabView } from 'src/shared/helpers/models';
import { DashboardService } from '../../services/dashboard/dashboard.service';

/**
 * get dashboard tabs information
 * set appropriate tab based on if page data param match tab id
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends Extender {
  public views: ITabView[];

  constructor(protected injector: Injector, private dashboardService: DashboardService) {
    super(injector);
    this.views = this.dashboardService.views;
  }

  /** get dashboard tabs information set appropriate tab based on if page data param match tab id */
  public ionViewDidEnter() {
    this.views = this.dashboardService.views;

    this.views.map((view) => {
      if (view.id === this.activatedRoute.snapshot.firstChild.data.page) {
        view.active = true;
      }
      return view;
    });
  }
}
