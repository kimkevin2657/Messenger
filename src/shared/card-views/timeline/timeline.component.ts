import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { IFeed } from 'src/pages/feed/models/feed';
import { Extender } from 'src/shared/helpers/extender';

@Component({
  selector: 'feed-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent extends Extender implements OnInit {
  /**
   * @description holds data for current users contact profile
   * @property me
   * @type Contact
   * @public
   */
  public me: IUser;

  /**
   * @description holds data for current users friends feed
   * @property feed
   * @type Feed[]
   * @public
   */
  @Input() public feed: IFeed;

  /**
   * @description emits event with type and feed
   * @example clicking like button will emit {type: 'like', data: feed}
   * @property cardEvent
   * @type EventEmitter<{type: string, data: Feed}>
   * @public
   */
  @Output() public event = new EventEmitter<{ type: string; data: IFeed }>();

  /**
   * @constructor
   * @param injector {Injector}
   */
  constructor(protected injector: Injector, private authService: AuthService) {
    super(injector);
  }

  /**
   * @description get user on component init
   * @method ngOnInit
   * @public
   * @returns void
   */
  public async ngOnInit() {
    this.me = await this.authService.getUser();
  }

  /**
   * @description onclick emit event with event name and data
   * @method clicked
   * @param {string} name
   * @public
   * @returns void
   */
  public clicked(name: string): void {
    this.event.emit({ type: name, data: this.feed });
  }
}
