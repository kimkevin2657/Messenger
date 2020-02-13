import { Component, Injector, OnInit } from '@angular/core';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { IFeed } from 'src/pages/feed/models/feed';
import { FeedService } from 'src/pages/feed/services/feed/feed.service';
import { Extender } from 'src/shared/helpers/extender';
import { ImagePreviewComponent } from 'src/shared/modals/image-preview/image-preview.component';

/**
 * get users posts images and list them in a gallery format
 */
@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent extends Extender implements OnInit {
  public posts: IFeed[] = [];

  constructor(protected injector: Injector, private authService: AuthService, private feedService: FeedService) {
    super(injector);
  }

  /** get user feed and extract images into one array */
  public async ngOnInit() {
    const { uid } = await this.authService.getUser();
    this.loading = true;
    this.subscriptions.push(
      this.feedService.getUserFeed(uid).subscribe((feed) => {
        this.loading = false;
        this.posts = [].concat.apply(
          [],
          feed.map((post) => post.images)
        );
      })
    );
  }

  /** open image preview */
  public async open(image: string) {
    const modal = await this.openModal(ImagePreviewComponent, image, 'custom-modal');
    modal.present();
  }
}
