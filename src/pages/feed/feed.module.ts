import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardViewsModule } from 'src/shared/card-views/card-views.module';
import { SharedModule } from 'src/shared/shared.module';
import { FeedAddComponent } from './components/feed-add/feed-add.component';
import { FeedCommentComponent } from './components/feed-comment/feed-comment.component';
import { FeedDetailComponent } from './components/feed-detail/feed-detail.component';
import { FeedComponent } from './components/feed/feed.component';

@NgModule({
  declarations: [FeedComponent, FeedDetailComponent, FeedAddComponent, FeedCommentComponent],
  entryComponents: [FeedAddComponent, FeedDetailComponent, FeedCommentComponent],
  imports: [
    CommonModule,
    SharedModule,
    CardViewsModule,
    RouterModule.forChild([{ path: '', component: FeedComponent }]),
  ],
})
export class FeedModule {}
