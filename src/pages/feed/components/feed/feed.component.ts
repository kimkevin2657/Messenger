import { Component, Injector, OnInit } from '@angular/core';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { ITabView } from 'src/shared/helpers/models';
import { CommonService } from 'src/shared/services/common/common.service';
import { IFeed } from '../../models/feed';
import { FeedService } from '../../services/feed/feed.service';
import { FeedAddComponent } from '../feed-add/feed-add.component';
import { FeedCommentComponent } from '../feed-comment/feed-comment.component';
import { FeedDetailComponent } from '../feed-detail/feed-detail.component';

/**
 * get feed from the app, displays 4 design versions, search feed, like and open comment for feed.
 * open feed detail and add new feed can all be accessed from feed component
 */
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent extends Extender implements OnInit {
  public feed: IFeed[];
  public openSearch: boolean = false;
  public view: ITabView;
  public views: ITabView[];
  public user: IUser;

  constructor(
    protected injector: Injector,
    private authService: AuthService,
    private feedService: FeedService,
    private commonService: CommonService
  ) {
    super(injector);
    this.views = this.feedService.views;
  }

  /** get current user, get feed
   * handle openPostFromUrl method
   */
  public async ngOnInit() {
    this.loading = true;

    this.user = await this.authService.getUser();
    this.openPostFromUrl();

    this.subscriptions.push(
      this.feedService.getFeed(this.user.uid).subscribe(
        (feed) => {
          this.feed = [...feed];
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          this.toast(err);
        }
      )
    );
  }

  /** if url has query param, navigate to view and id in param (used for share links when you click the share button) */
  public openPostFromUrl() {
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((param) => {
        if (param && param.id) {
          this.viewPost({ id: param.id });
        }
      })
    );
  }

  /** search friends feed */
  public onSearch(val: string): void {
    this.feed = this.feedService.searchFeed(val);
  }

  /** manage feed actions such as likes, comments etc */
  public manage(_event: { type: string; data: any }): void {
    if (_event.type === 'like') {
      this.feedService.like(_event.data);
    } else if (_event.type === 'comment') {
      this.comment(_event.data);
    } else if (_event.type === 'profile') {
      this.profile(_event.data);
    } else if (_event.type === 'share') {
      this.share(_event.data);
    } else if (_event.type === 'detail') {
      this.viewPost(_event.data);
    } else if (_event.type === 'more') {
      this.more(_event.data);
    }
  }

  /** delete a post */
  public delete(post: IFeed): void {
    this.feedService.delete(post);
  }

  /** go to post author's profile page */
  public profile(post: IFeed): void {
    this.goto(this.routes.people + '/' + post.user.uid);
  }

  /** open add post modal, add to array of feed after completed */
  public async addPost(): Promise<any> {
    const modal = await this.openModal(FeedAddComponent, null, 'custom-modal');
    modal.present();
  }

  /** open post details modal, update array of feed if any change is made */
  public async viewPost(post: IFeed): Promise<any> {
    const modal = await this.openModal(FeedDetailComponent, post.id);
    modal.present();
  }

  /** open feed's comments */
  public async comment(post: IFeed): Promise<any> {
    const modal = await this.openModal(FeedCommentComponent, post.id);
    modal.present();
  }

  /** open actionsheet for more options */
  public async more(data: IFeed): Promise<any> {
    const actionSheetCtrl = await this.actionSheetCtrl.create({
      header: this.translate.instant('feed-component.more-header'),
      buttons: [
        {
          text: this.translate.instant('feed-component.more-option-open'),
          handler: () => {
            this.viewPost(data);
          }
        },
        {
          text: this.translate.instant('feed-component.more-option-delete'),
          handler: () => {
            this.delete(data);
          }
        },
        {
          text: this.translate.instant('other.close'),
          role: 'cancel'
        }
      ]
    });
    await actionSheetCtrl.present();
  }

  /** share feed to other apps */
  public share(post: IFeed): void {
    const url = `feed?id=${post.id}`;
    this.commonService.share(post.content, post.title, post.images, url);
  }
}
