import { Injectable, Injector } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import * as firebase from 'firebase/app';
import { combineLatest, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { ITabView } from 'src/shared/helpers/models';
import { FirestoreService } from 'src/shared/services/firestore/firestore.service';

/**
 * crud methods to interact with firebase cloud store regarding users
 */
@Injectable({
  providedIn: 'root'
})
export class PeopleService extends Extender {
  public friends: string[] = [];

  constructor(
    protected injector: Injector,
    private callNumber: CallNumber,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    super(injector);
  }

  /** get alphabets A to Z */
  public get alpha(): string[] {
    const a = [];
    let i = 'A'.charCodeAt(0);
    const j = 'Z'.charCodeAt(0);
    for (; i <= j; ++i) {
      a.push(String.fromCharCode(i));
    }
    return a;
  }

  /** get tabbed views detail */
  public get views(): ITabView[] {
    return [
      {
        id: 0,
        name: 'All',
        active: true,
        event: () => {}
      },
      {
        id: 1,
        name: 'Friends',
        event: () => {}
      }
    ];
  }

  /** sort and group people by first letter of their name and return an array of letter
   * and then array of users with that first letter of display name
   */
  public groupPeople(people: IUser[]): Array<{ letter: string; people: IUser[] }> {
    const sortedContacts = people.sort((a, b) => {
      return a.displayName.toLowerCase() > b.displayName.toLowerCase()
        ? 1
        : b.displayName.toLowerCase() > a.displayName.toLowerCase()
        ? -1
        : 0;
    });
    let currentLetter: boolean | any = false;
    let currentContacts = [];
    const groupedPeople = [];

    sortedContacts.forEach((value: IUser) => {
      if (value.displayName.charAt(0).toString() !== currentLetter) {
        currentLetter = value.displayName.charAt(0);
        const newGroup = {
          letter: currentLetter,
          people: []
        };
        currentContacts = newGroup.people;
        groupedPeople.push(newGroup);
      }
      currentContacts.push(value);
    });

    return groupedPeople;
  }

  /** get users from users collection, remove current user from list */
  public getPeople(uid: string) {
    return this.firestoreService.colWithIds$(`users`).pipe(
      map((users) => {
        return users.filter((user) => user.uid !== uid);
      })
    );
  }

  /** get a single user by id and return as promise */
  public getPerson(uid: string) {
    return this.firestoreService
      .doc$<IUser>(`users/${uid}`)
      .pipe(first())
      .toPromise();
  }

  /** get friends ids from friends collection */
  public getFriendIds(uid: string) {
    return this.firestoreService.doc$<any>(`friends/${uid}`).pipe(
      map((friends) => {
        this.friends = friends.friendIds;
        return friends.friendIds;
      })
    );
  }

  /** get friends data from friends collection. friends collection only stores id so get user object for each id using switch map */
  public getFriends(uid: string) {
    return this.firestoreService.doc$<any>(`friends/${uid}`).pipe(
      switchMap((_friend: any) => {
        const reads = [];
        if (_friend.friendIds.length > 0) {
          _friend.friendIds.forEach((item: any) => {
            reads.push(this.firestoreService.doc$(`users/${item}`));
          });
          return combineLatest(reads);
        } else {
          return of([]);
        }
      }),
      map((friends: IUser[]) => {
        return friends;
      })
    );
  }

  /** get followers ids from friends where friendsIds array contains current users uid */
  public getFollowersIds(uid: string) {
    return this.firestoreService
      .colWithIds$<any>(`friends`, (ref) => ref.where('friendIds', 'array-contains', uid))
      .pipe(
        map((friends) => {
          return friends;
        })
      );
  }

  /** get followers data from friends where friendsIds array contains current users uid
   * friends collection only stores id so get user object for each id using switch map
   */
  public getFollowers(uid: string) {
    return this.firestoreService
      .colWithIds$<any>(`friends`, (ref) => ref.where('friendIds', 'array-contains', uid))
      .pipe(
        switchMap((_friend: any) => {
          const reads = [];
          if (_friend.length > 0) {
            _friend.forEach((item: any) => {
              reads.push(this.firestoreService.doc$(`users/${item.id}`));
            });
            return combineLatest(reads);
          } else {
            return of([]);
          }
        }),
        map((friends: IUser[]) => {
          return friends;
        })
      );
  }

  /** follow user by creating/updating friendsIds in friends collection */
  public async follow(fid: string) {
    const { uid } = await this.authService.getUser();
    return await this.firestoreService.set<IUser>(`friends/${uid}`, {
      friendIds: firebase.firestore.FieldValue.arrayUnion(fid)
    });
  }

  /** unfollow user by removing friendsIds in friends collection */
  public async unfollow(fid: string) {
    const { uid } = await this.authService.getUser();
    return await this.firestoreService.update(`friends/${uid}`, {
      friendIds: firebase.firestore.FieldValue.arrayRemove(fid)
    });
  }
}
