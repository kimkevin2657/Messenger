import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { IFeed } from 'src/pages/feed/models/feed';
import { Extender } from 'src/shared/helpers/extender';

@Component({
  selector: 'feed-modern',
  templateUrl: './modern.component.html',
  styleUrls: ['./modern.component.scss'],
})
export class ModernComponent extends Extender implements OnInit {
  /**
   * @description holds data for current users contact profile
   * @property me
   * @type Contact
   * @public
   */
  public me: IUser;

  /**
   * @description holds current index of image
   * @property currentIndex
   * @type number
   * @public
   * @default 0
   */
  public currentIndex: number = 0;

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
  @Output() public event: EventEmitter<{
    type: string;
    data: IFeed;
  }> = new EventEmitter<{ type: string; data: IFeed }>();

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

  /**
   * @description navigate to the next image
   * @method forward
   * @public
   * @returns void
   */
  public forward(): void {
    if (this.currentIndex < this.feed.images.length - 1) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0;
    }
  }

  /**
   * @description navigate to the previous image
   * @method back
   * @public
   * @returns void
   */
  public back(): void {
    if (this.currentIndex < 1) {
      this.currentIndex = this.feed.images.length - 1;
    } else {
      this.currentIndex -= 1;
    }
  }
}
