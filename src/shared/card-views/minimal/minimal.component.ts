import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { IFeed } from 'src/pages/feed/models/feed';
import { Extender } from 'src/shared/helpers/extender';

@Component({
  selector: 'feed-minimal',
  templateUrl: './minimal.component.html',
  styleUrls: ['./minimal.component.scss'],
})
export class MinimalComponent extends Extender implements OnInit {
  /** holds data for current users contact profile */
  public me: IUser;

  /** holds data for current users friends feed */
  @Input() public feed: IFeed;

  /** emits event with type and feed */
  @Output() public event: EventEmitter<{
    type: string;
    data: IFeed;
  }> = new EventEmitter<{ type: string; data: IFeed }>();

  constructor(protected injector: Injector, private authService: AuthService) {
    super(injector);
  }

  /** get user on component init */
  public async ngOnInit() {
    this.me = await this.authService.getUser();
  }

  /** onclick emit event with event name and data */
  public clicked(name: string): void {
    this.event.emit({ type: name, data: this.feed });
  }
}
