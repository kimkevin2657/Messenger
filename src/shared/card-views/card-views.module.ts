import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { MinimalComponent } from './minimal/minimal.component';
import { ModernComponent } from './modern/modern.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  declarations: [MinimalComponent, ModernComponent, TimelineComponent, ShowcaseComponent],
  imports: [CommonModule, SharedModule],
  exports: [MinimalComponent, ModernComponent, TimelineComponent, ShowcaseComponent],
  providers: [],
})
export class CardViewsModule {}
