import { Injectable, Injector } from '@angular/core';
import * as firebase from 'firebase/app';
import { combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { ITabView } from 'src/shared/helpers/models';
import { FirestoreService } from 'src/shared/services/firestore/firestore.service';
import { isArray } from 'util';
import { IComment } from '../../models/comment';
import { IFeed } from '../../models/feed';

/**
 * crud methods to interact with firebase cloud store regarding feed posts
 */
@Injectable({
  providedIn: 'root'
})
export class FeedService extends Extender {
  public get views(): ITabView[] {
    return [
      {
        id: 1,
        icon: 'albums',
        name: this.translate.instant('feed-component.minimal'),
        active: true
      },
      {
        id: 2,
        icon: 'paper',
        name: this.translate.instant('feed-component.timeline')
      },
      {
        id: 3,
        icon: 'browsers',
        name: this.translate.instant('feed-component.showcase')
      },
      {
        id: 4,
        icon: 'cube',
        name: this.translate.instant('feed-component.modern')
      }
    ];
  }
  private comments: IComment[];
  private feed: IFeed[] = [];

  constructor(protected injector: Injector, private authService: AuthService, private firestoreService: FirestoreService) {
    super(injector);
  }

  /** get feed from fire base cloud store, set default likes and comments array to empty array if not already set */
  public getFeed(uid: string) {
    return this.firestoreService
      .colWithIds$<IFeed>(`feed`, (ref: any) => ref.orderBy('createdAt', 'desc').limit(50))
      .pipe(
        switchMap((_feed: IFeed[]) => {
          const reads = [];
          this.feed = _feed.map((item) => {
            item.likes = !item.likes ? [] : item.likes;
            item.comments = !item.comments ? [] : item.comments;
            return item;
          });
          this.feed.forEach((item: IFeed) => {
            reads.push(this.firestoreService.doc$(`users/${item.uid}`));
          });
          return combineLatest(reads);
        }),
        map((data: any) => {
          return (this.feed = this.feed.map((item: IFeed, index: number) => {
            return {
              ...item,
              userLiked: item.likes && isArray(item.likes) ? item.likes.includes(uid) : false,
              user: data[index] || null
            };
          }));
        })
      );
  }

  public getUserFeed(uid) {
    return this.firestoreService.colWithIds$<IFeed>(`feed`, (ref: any) => ref.where('uid', '==', uid));
  }

  /** get a single post from feed collection in firestore and join its user and comments */
  public getPost(pid: string, uid: string) {
    let feed;
    return this.firestoreService.doc$(`feed/${pid}`).pipe(
      switchMap((_feed: IFeed) => {
        _feed.likes = !_feed.likes ? [] : _feed.likes;
        _feed.comments = !_feed.comments ? [] : _feed.comments;
        feed = _feed;
        const docs = [];
        docs.push(this.firestoreService.doc$(`users/${feed.uid}`));
        docs.push(this.firestoreService.colWithIds$(`feed/${pid}/comments`, (ref) => ref.where('fid', '==', feed.id)));

        return combineLatest(docs);
      }),
      map((arr: any) => {
        const joins = ['user', 'comments'].reduce((acc, cur, idx) => {
          return { ...acc, [cur]: arr[idx] };
        }, {});
        return { ...feed, ...joins, userLiked: feed.likes && isArray(feed.likes) ? feed.likes.includes(uid) : false };
      })
    );
  }

  public searchFeed(val: string) {
    const feed = [...this.feed];

    if (val && val.trim() !== '') {
      return feed.filter((item) => {
        return (
          item.title.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item.subtitle.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item.content.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item.user.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    } else {
      return this.feed;
    }
  }

  public async upsertPost(post: IFeed) {
    return await this.firestoreService.set(`feed/${post.id}`, post);
  }

  public async delete(post: IFeed) {
    return await this.firestoreService.delete(`feed/${post.id}`);
  }

  public getComments(fid: string, uid: string) {
    return this.firestoreService
      .colWithIds$<IComment>(`feed/${fid}/comments`, (ref: any) => ref.limit(20))
      .pipe(
        switchMap((_comment: IComment[]) => {
          const reads = [];
          this.comments = _comment;
          if (this.comments.length > 0) {
            this.comments.forEach((item: IComment) => {
              reads.push(this.firestoreService.doc$(`users/${item.uid}`));
            });
            return combineLatest(reads);
          } else {
            return of([]);
          }
        }),
        map((data: any) => {
          return (this.comments = this.comments.map((item: IComment, index: number) => {
            return {
              ...item,
              user: data[index] || null
            };
          }));
        })
      );
  }

  public searchComments(val: string) {
    const comments = [...this.comments];

    if (val && val.trim() !== '') {
      return comments.filter((item) => {
        return (
          item.text.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.user.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    } else {
      return this.comments;
    }
  }

  public async upsertComment(comment: IComment) {
    if (!comment.id) {
      comment.id = this.firestoreService.createId();
    }
    if (comment.user) {
      delete comment.user;
    }
    await this.firestoreService.set(`feed/${comment.fid}/comments/${comment.id}`, comment);
    return this.firestoreService.update(`feed/${comment.fid}`, {
      comments: firebase.firestore.FieldValue.arrayUnion(comment.id)
    });
  }

  public async deleteComment(comment: IComment) {
    await this.firestoreService.delete(`feed/${comment.fid}/comments/${comment.id}`);
    return this.firestoreService.update(`feed/${comment.fid}`, {
      comments: firebase.firestore.FieldValue.arrayRemove(comment.id)
    });
  }

  public async like(feed: IFeed) {
    const { uid } = await this.authService.getUser();
    if (!feed.userLiked) {
      this.firestoreService.update(`feed/${feed.id}`, {
        likes: firebase.firestore.FieldValue.arrayUnion(uid)
      });
    } else {
      this.firestoreService.update(`feed/${feed.id}`, {
        likes: firebase.firestore.FieldValue.arrayRemove(uid)
      });
    }
  }
}
