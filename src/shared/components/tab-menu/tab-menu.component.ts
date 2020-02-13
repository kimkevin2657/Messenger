import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements AfterViewInit {
  /** stores tab data */
  @Input() public tabs: Array<{
    id: number;
    icon: string;
    name: string;
    active?: boolean;
    event: () => void;
  }> = [];

  /** emits event from tab selection */
  @Output() public event: EventEmitter<any> = new EventEmitter<any>();

  public ngAfterViewInit(): void {}

  /** @description select tab and emit selection event */
  public onViewSelect(index: number): void {
    this.tabs.map((_view) => (_view.active = false));
    this.tabs[index].active = true;
    this.event.emit(this.tabs[index].id);
  }
}
