import { AfterViewInit, Component, ContentChildren, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { Extender } from 'src/shared/helpers/extender';
import { PanelComponent } from '../panel/panel.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent extends Extender implements AfterViewInit {
  @ContentChildren(PanelComponent) public panels: QueryList<PanelComponent>;

  private _subscriptions: Subscription = new Subscription();

  /** for each panel add subscription to panel to listen for toggle events */
  public ngAfterViewInit() {
    if (this.panels) {
      this.panels.forEach((panel) => {
        this._subscriptions.add(this._subscribeToPanel(panel));
      });
    }
  }

  /** unsubscribe from panel subscription */
  public ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  /** subscribe to panel toggle event and update isBodyVisible accordingly */
  private _subscribeToPanel(currentPanel: PanelComponent): Subscription {
    return currentPanel.toggle.subscribe((show) => {
      if (show) {
        this.panels.forEach((panel) => {
          panel.isBodyVisible = false;
        });

        currentPanel.isBodyVisible = true;
      }
    });
  }
}
