import { Component, Injector, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { AppService } from 'src/app/services/app/app.service';
import { IPreference } from 'src/pages/setting/model/preference';
import { Extender } from 'src/shared/helpers/extender';
import { CommonService } from 'src/shared/services/common/common.service';
import { FirestoreService } from 'src/shared/services/firestore/firestore.service';

@Component({
  selector: 'app-lang-select',
  templateUrl: './lang-select.component.html',
  styleUrls: ['./lang-select.component.scss']
})
export class LangSelectComponent extends Extender implements OnInit {
  public countries: any[];
  public setting: IPreference;

  constructor(
    protected injector: Injector,
    private navParams: NavParams,
    private commonService: CommonService,
    private appService: AppService,
    private firestoreService: FirestoreService
  ) {
    super(injector);
  }

  /** get settings from nav params */
  public ngOnInit() {
    this.setting = this.navParams.get('data');
    this.subscriptions.push(this.commonService.getCountries().subscribe((countries) => (this.countries = countries)));
  }

  /** select a country, update lang preference and set translation with new lang data */
  public select(lang: string) {
    if (!(lang === 'gb' || lang === 'es' || lang === 'fr')) {
      lang = 'gb';
    }
    this.setting.language = lang;
    this.firestoreService.upsert(`preferences/${this.setting.uid}`, this.setting);
    this.appService.langConfig(lang);
    this.closeModal();
  }
}
