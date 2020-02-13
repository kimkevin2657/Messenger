import { Component, Injector, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { IComment } from '../../models/comment';
import { FeedService } from '../../services/feed/feed.service';

/**
 * enable user to add comments to a post
 */
@Component({
  selector: 'app-feed-comment',
  templateUrl: './feed-comment.component.html',
  styleUrls: ['./feed-comment.component.scss']
})
export class FeedCommentComponent extends Extender implements OnInit {
  public user: IUser;
  public comments: IComment[] = [];
  public editComment: IComment;
  public commentMsg: string;
  public openSearch: boolean = false;

  constructor(
    protected injector: Injector,
    private navParams: NavParams,
    private authService: AuthService,
    private feedService: FeedService
  ) {
    super(injector);
  }

  /** get current user and post id from navParams and get comments for the post */
  public async ngOnInit() {
    this.user = await this.authService.getUser();
    const fid = this.navParams.get('data');
    this.loading = true;
    this.subscriptions.push(
      this.feedService.getComments(fid, this.user.uid).subscribe(
        (comments) => {
          this.loading = false;
          this.comments = comments;
        },
        (err) => {
          this.loading = false;
          this.toast(err);
        }
      )
    );
  }

  /** search comments */
  public onSearch(val: string) {
    this.comments = this.feedService.searchComments(val);
  }

  /** save or edit new or existing comment */
  public save(text: string) {
    let comment: IComment;
    if (this.editComment) {
      comment = this.editComment;
      comment.text = text;
    } else {
      comment = {
        uid: this.user.uid,
        fid: this.navParams.get('data'),
        text
      };
    }
    this.feedService.upsertComment(comment).then(() => {
      comment = null;
      this.commentMsg = null;
      this.editComment = null;
    });
  }

  /** manage comment by opening actionsheet and displaying options edit or delete comment. */
  public async openOptions(comment: IComment): Promise<any> {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('other.options'),
      buttons: [
        {
          text: this.translate.instant('other.edit-label'),
          handler: () => {
            this.editComment = comment;
            this.commentMsg = comment.text;
          }
        },
        {
          text: this.translate.instant('other.delete-label'),
          handler: () => {
            this.feedService.deleteComment(comment);
          }
        },
        {
          text: this.translate.instant('other.cancel'),
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }
}
