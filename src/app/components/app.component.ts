import { Component, Injector, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { SettingService } from 'src/pages/setting/services/setting/setting.service';
import { Extender } from 'src/shared/helpers/extender';
import { FcmService } from 'src/shared/services/fcm/fcm.service';
import { AppService, IAppPages } from '../services/app/app.service';

/**
 * @class AppComponent
 * @extends Extender
 * @implements OnInit
 * sets pages for side-menu when user is logged in. default color used here to style side-menu buttons in a gradient.
 * here we set and store default language to english until user can make changes either in welcome page or from user settings.
 * we also register fire cloud messaging and token and listen for notifications in-app.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent extends Extender implements OnInit {
  public pages = [];
  public color: string = '#009688';

  constructor(
    protected injector: Injector,
    private appService: AppService,
    private authService: AuthService,
    private fcmService: FcmService,
    private settingService: SettingService,
    private storage: Storage
  ) {
    super(injector);
  }

  /**
   * run initializeApp from appServices
   * get language from localstorage, if language is set, use to configure translations
   * otherwise default to english (gb)
   * if user is logged in, get firebase cloud messaging token and listen for notifications
   * setup app pages
   * get user preferences to setup lang
   */
  public async ngOnInit() {
    this.appService.initializeApp();
    const lang = await this.storage.get('language');
    this.appService.langConfig(lang);
    this.subscriptions.push(
      this.authService.user.subscribe((user) => {
        if (user) {
          this.fcmService.getToken().then(() => {
            this.listen4Notifications();
          });
          this.subscriptions.push(
            this.settingService.getUserSettings(user.uid).subscribe((setting) => this.appService.langConfig(setting.language))
          );
          this.pages = this.appService.setUpPages(user);
        }
      })
    );
  }

  /**
   * open component pages except for when component property is logout
   * then logout user from app and route to login page
   * @param page
   */
  public open(page: IAppPages) {
    if (page.component === 'logout') {
      this.authService.signOut().then(() => this.goto(this.routes.login));
    } else {
      this.goto(page.component);
    }
  }

  /* Listen to incoming messages */
  private listen4Notifications() {
    this.subscriptions.push(this.fcmService.listenToNotifications().subscribe());
  }
}
