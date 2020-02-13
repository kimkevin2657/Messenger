import { Component, Injector, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { CommonService } from 'src/shared/services/common/common.service';
import { IFeed } from '../../models/feed';
import { FeedService } from '../../services/feed/feed.service';
import { FeedAddComponent } from '../feed-add/feed-add.component';
import { FeedCommentComponent } from '../feed-comment/feed-comment.component';

/**
 * view post details
 */
@Component({
  selector: 'app-feed-detail',
  templateUrl: './feed-detail.component.html',
  styleUrls: ['./feed-detail.component.scss']
})
export class FeedDetailComponent extends Extender implements OnInit {
  public user: IUser;
  public feed: IFeed = null;
  public comments: Comment[];
  public liked: string;
  public currentIndex: number = 0;

  constructor(
    protected injector: Injector,
    private navParams: NavParams,
    private commonService: CommonService,
    private authService: AuthService,
    private feedService: FeedService
  ) {
    super(injector);
  }

  /** get user and get post */
  public async ngOnInit() {
    this.user = await this.authService.getUser();
    const id = this.navParams.get('data');
    this.subscriptions.push(this.feedService.getPost(id, this.user.uid).subscribe((feed) => (this.feed = feed)));
  }

  /** open action sheet with options to edit, delete, access comments, like or share post */
  public async openOptions(feed: IFeed) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('other.options'),
      buttons: [
        {
          text: this.translate.instant('other.edit-label'),
          handler: () => {
            this.edit(feed);
          }
        },
        {
          text: this.translate.instant('other.delete-label'),
          role: 'destructive',
          handler: () => {
            this.delete(feed);
          }
        },
        {
          text: this.translate.instant('feed-detail-component.open-comments'),
          handler: () => {
            this.comment(feed);
          }
        },
        {
          text: this.translate.instant('feed-detail-component.like'),
          handler: () => {
            this.like();
          }
        },
        {
          text: this.translate.instant('feed-detail-component.share-button'),
          handler: () => {
            this.share(feed);
          }
        },
        {
          text: this.translate.instant('other.cancel'),
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  /** open edit modal with post id */
  public async edit(post: IFeed) {
    if (post.user.uid === this.user.uid) {
      const modal = await this.openModal(FeedAddComponent, post.id, 'custom-modal');
      await modal.present();
    } else {
      this.toast(this.translate.instant('feed-detail-component.cannot-edit'));
    }
  }

  /** like feed */
  public like() {
    this.feedService.like(this.feed);
  }

  /** open comments */
  public async comment(post: IFeed): Promise<any> {
    const modal = await this.openModal(FeedCommentComponent, post);
    modal.present();
  }

  /** get post url and share post */
  public share(post: IFeed) {
    const url = `feed?id=${post.id}`;
    this.commonService.share(post.content, post.title, post.images, url);
  }

  /** show prompt and delete post */
  public async delete(post: IFeed) {
    if (post.uid === this.user.uid) {
      const prompt = await this.alertCtrl.create({
        header: this.translate.instant('feed-detail-component.delete-alert-title'),
        message: this.translate.instant('feed-detail-component.delete-alert-message'),
        buttons: [
          {
            text: this.translate.instant('other.cancel'),
            role: 'cancel'
          },
          {
            text: this.translate.instant('other.delete-label'),
            handler: () => {
              this.feedService.delete(post).then(() => {
                this.modalCtrl.dismiss();
                this.toast(this.translate.instant('feed-detail-component.confirm-delete'));
              });
            }
          }
        ]
      });
      await prompt.present();
    } else {
      this.toast(this.translate.instant('feed-detail-component.cannot-delete'));
    }
  }

  /** navigate to the next image */
  public forward(): void {
    if (this.currentIndex < this.feed.images.length - 1) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0;
    }
  }

  /** navigate to the previous image */
  public back(): void {
    if (this.currentIndex < 1) {
      this.currentIndex = this.feed.images.length - 1;
    } else {
      this.currentIndex -= 1;
    }
  }
}
