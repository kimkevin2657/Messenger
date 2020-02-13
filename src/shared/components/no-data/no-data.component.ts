import { Component, Injector, Input, OnInit } from '@angular/core';
import { Extender } from 'src/shared/helpers/extender';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent extends Extender implements OnInit {
  @Input() public config: INoData = {};

  constructor(protected injector: Injector) {
    super(injector);
  }

  /** defaults */
  public ngOnInit() {
    this.config = Object.assign(
      {
        image: { show: true, url: 'assets/images/other/no-data.png' },
        content: { title: this.translate.instant('misc.no-data'), description: null }
      },
      this.config
    );
  }
}

export interface INoData {
  image?: { show?: boolean; url?: string };
  content?: { title?: string; description?: string };
}
