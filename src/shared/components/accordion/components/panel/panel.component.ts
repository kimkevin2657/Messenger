import {
  Component,
  ContentChild,
  HostBinding,
  Input,
  OnInit,
  TemplateRef
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  public isBodyVisible: boolean = false;
  public toggle: Subject<boolean> = new Subject<boolean>();
  @Input() public open: boolean = false;
  @Input() public title: string = 'Panel';
  @HostBinding('class') @Input() public color: string = 'primary';

  public ngOnInit(): void {
    this.isBodyVisible = this.open;
  }

  public onClick(): void {
    this.isBodyVisible = !this.isBodyVisible;
    this.toggle.next(this.isBodyVisible);
  }
}
