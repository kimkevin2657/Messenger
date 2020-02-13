import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AccordionComponent } from './components/accordion/accordion.component';
import { PanelComponent } from './components/panel/panel.component';

@NgModule({
  declarations: [AccordionComponent, PanelComponent],
  exports: [AccordionComponent, PanelComponent],
  imports: [CommonModule, IonicModule]
})
export class AccordionModule {}
