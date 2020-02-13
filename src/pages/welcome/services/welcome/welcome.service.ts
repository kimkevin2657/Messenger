import { Injectable, Injector } from '@angular/core';
import { Extender } from 'src/shared/helpers/extender';
import { IWelcomeSlides } from '../../model/model';

/**
 * set data for languages and slides in welcome component
 */
@Injectable({
  providedIn: 'root'
})
export class WelcomeService extends Extender {
  /** set app language options this property is used by component to set language dropdown */
  private _languages: Array<{ icon: string; text: string; code: string }> = [
    {
      icon: 'assets/images/flags/gb.svg',
      text: this.translate.instant('welcome-component.english'),
      code: 'gb'
    },
    {
      icon: 'assets/images/flags/es.svg',
      text: this.translate.instant('welcome-component.spanish'),
      code: 'es'
    },
    {
      icon: 'assets/images/flags/fr.svg',
      text: this.translate.instant('welcome-component.french'),
      code: 'fr'
    }
  ];

  /** set welcome slides data */
  private _slides: IWelcomeSlides[] = [
    {
      image: '../assets/images/logo.png',
      title: 'welcome-component.slide-1-title',
      paragraph: 'welcome-component.slide-1-paragraph'
    },
    {
      image: '../assets/images/welcome/profile.jpg',
      title: 'welcome-component.slide-2-title',
      paragraph: 'welcome-component.slide-2-paragraph'
    },
    {
      image: '../assets/images/welcome/feed.jpeg',
      title: 'welcome-component.slide-3-title',
      paragraph: 'welcome-component.slide-3-paragraph'
    },
    {
      image: '../assets/images/welcome/friends.jpg',
      title: 'welcome-component.slide-4-title',
      paragraph: 'welcome-component.slide-4-paragraph'
    },
    {
      image: '../assets/images/welcome/chat.jpg',
      title: 'welcome-component.slide-5-title',
      paragraph: 'welcome-component.slide-5-paragraph'
    }
  ];
  constructor(protected injector: Injector) {
    super(injector);
  }

  /** public getter to make language property accessible */
  public get languages() {
    return this._languages;
  }

  /** public getter to make slides property accessible */
  public get slides() {
    return this._slides;
  }
}
