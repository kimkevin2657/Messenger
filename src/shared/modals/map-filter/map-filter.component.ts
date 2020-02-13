import { Component, Injector, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Extender } from 'src/shared/helpers/extender';

@Component({
  selector: 'app-map-filter',
  templateUrl: './map-filter.component.html',
  styleUrls: ['./map-filter.component.scss'],
})
export class MapFilterComponent extends Extender implements OnInit {
  public filter: { radius: number; openNow: boolean; type: string; zoom: number };

  public typeSelectOptions = {
    header: 'Select Type',
    data: ['gym', 'hospital', 'spa', 'doctor', 'store', 'supermarket']
  };
  constructor(protected injector: Injector, private navParams: NavParams) {
    super(injector);
  }

  public ngOnInit() {
    this.filter = this.navParams.get('data');
    if (!this.filter) {
      this.filter = {
        radius: 0,
        openNow: false,
        type: null,
        zoom: 0
      };
    }
  }

  public save() {
    this.closeModal(this.filter);
  }
}
