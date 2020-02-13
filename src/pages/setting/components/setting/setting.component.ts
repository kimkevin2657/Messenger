import { Component, Injector, OnInit } from '@angular/core';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { IPreference, ISetting } from '../../model/preference';
import { SettingService } from '../../services/setting/setting.service';

/**
 * manage users preferences
 */
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent extends Extender implements OnInit {
  public currentUser: IUser;
  public settingOptions: ISetting[];
  public setting: IPreference;

  constructor(protected injector: Injector, private authService: AuthService, private settingService: SettingService) {
    super(injector);
  }

  /** get settings and setting options from settings service. set uid to current user id.
   *  this is necessary if no settings has been saved previously
   */
  public async ngOnInit() {
    this.currentUser = await this.authService.getUser();
    this.subscriptions.push(this.settingService.getUserSettings(this.currentUser.uid).subscribe((data) => {
      this.setting = data;
      this.setting.uid = this.currentUser.uid;
    }));
    this.subscriptions.push(this.settingService.settingsOptions.subscribe((data) => (this.settingOptions = data)));
  }

  /** save or update user preferences  */
  public save() {
    this.settingService.upsertPreferences(this.settingService.setting);
  }

  /** logout and return to welcome or auth screen */
  public signOut() {
    const { hideWalkthrough } = this.setting;
    this.authService.signOut().then(() => {
      if (hideWalkthrough) {
        this.goto(this.routes.auth);
      } else {
        this.goto(this.routes.welcome);
      }
    });
  }
}
