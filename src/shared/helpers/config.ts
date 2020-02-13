import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/** translate http loader functions
 * https://github.com/ngx-translate/http-loader
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * This class overrides the default Angular gesture config and adds hammer gesture config
 * make sure hammer is imported in main.ts
 * https://medium.com/madewithply/ionic-4-long-press-gestures-96cf1e44098b
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
  public buildHammer(element: HTMLElement) {
    const mc = new (window as any).Hammer(element);

    for (const eventName in this.overrides) {
      if (eventName) {
        mc.get(eventName).set(this.overrides[eventName]);
      }
    }

    return mc;
  }
}
