import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AppService } from 'src/app/services/app/app.service';
import { Extender } from 'src/shared/helpers/extender';
import { IWelcomeSlides } from '../../model/model';
import { WelcomeService } from '../../services/welcome/welcome.service';

/**
 * welcome screen with walkthrough on using the app and access to auth module
 */
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent extends Extender implements OnInit {
  /** stores slides array from service */
  public slides: IWelcomeSlides[] = [];

  /** save active index of slides */
  public currentIndex: number = 0;

  /** stores languages array from service */
  public languages: Array<{ icon: string; text: string; code: string }>;

  /** stores language data */
  public language: { icon: string; text: string; code: string } = null;

  /** get reference to slide element */
  @ViewChild(IonSlides, null) public slider: IonSlides;

  constructor(
    protected injector: Injector,
    private storage: Storage,
    private appService: AppService,
    private welcomeService: WelcomeService
  ) {
    super(injector);
  }

  /** get slides and languages data from services
   * set selected language from device local storage or default to gb
   */
  public async ngOnInit() {
    this.slides = this.welcomeService.slides;
    this.languages = this.welcomeService.languages;
    const lang = await this.storage.get('language');
    if (lang) {
      this.language = this.languages.find((item) => item.code === lang);
    } else {
      this.language = this.languages[0];
    }
  }

  /** on slide changes, update currentIndex property, this will update our custom navigation bullets */
  public slideChanged() {
    this.slider.getActiveIndex().then((index) => {
      this.currentIndex = index;
    });
  }

  /** open an action sheet with language options */
  public async openLanguage(): Promise<any> {
    const actionSheetCtrl = await this.actionSheetCtrl.create({
      header: this.translate.instant('welcome-component.select-lang'),
      buttons: [
        {
          text: this.translate.instant('welcome-component.english'),
          handler: () => {
            this.changeLanguage('gb');
          }
        },
        {
          text: this.translate.instant('welcome-component.spanish'),
          handler: () => {
            this.changeLanguage('es');
          }
        },
        {
          text: this.translate.instant('welcome-component.french'),
          handler: () => {
            this.changeLanguage('fr');
          }
        },
        {
          text: this.translate.instant('other.close'),
          role: 'cancel'
        }
      ]
    });

    await actionSheetCtrl.present();
  }

  /**
   * change language based on actionsheet selection
   */
  public changeLanguage(lang: string): void {
    this.appService.langConfig(lang);
    this.language = this.languages.find((data) => data.code === lang);
  }
}
