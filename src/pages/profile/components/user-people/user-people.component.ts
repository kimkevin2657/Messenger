import { Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { MessagesService } from 'src/pages/messages/services/messages/messages.service';
import { PeopleService } from 'src/pages/people/services/people/people.service';
import { Extender } from 'src/shared/helpers/extender';
import { CommonService } from 'src/shared/services/common/common.service';
import { isArray } from 'util';

/**
 * toggle to get either users followers or friends by toggling following input property
 * list users
 */
@Component({
  selector: 'app-user-people',
  templateUrl: './user-people.component.html',
  styleUrls: ['./user-people.component.scss']
})
export class UserPeopleComponent extends Extender implements OnInit {
  public user: IUser;
  public friends: IUser[] = [];
  public friendsIds: any;
  @Input() public following: boolean = false;
  @ViewChild('callNumber', null) public callNumber: ElementRef;
  constructor(
    protected injector: Injector,
    private authService: AuthService,
    private commonService: CommonService,
    private messageService: MessagesService,
    private peopleService: PeopleService
  ) {
    super(injector);
  }

  /** get current user, if following input property is true, get current users followers
   * if false, get current users friends
   */
  public async ngOnInit() {
    this.user = await this.authService.getUser();
    this.loading = true;
    if (!this.following) {
      this.subscriptions.push(
        this.peopleService.getFriends(this.user.uid).subscribe((friends) => {
          this.loading = false;
          this.friends = friends;
        })
      );
    } else {
      this.subscriptions.push(
        this.peopleService.getFollowers(this.user.uid).subscribe((friends) => {
          this.loading = false;
          this.friends = friends;
        })
      );
    }
    this.subscriptions.push(this.peopleService.getFriendIds(this.user.uid).subscribe((data) => (this.friendsIds = data)));
  }

  /** call user */
  public async call() {
    await this.commonService.callUser(this.user.mobile || this.user.phone, this.callNumber);
    this.closeModal();
  }

  /** start chat with user */
  public async chat() {
    this.messageService.startChat(this.user);
    this.closeModal();
  }

  /** share user */
  public async share() {
    const url = `people?id=${this.user.uid}`;
    await this.commonService.share(this.user.displayName, this.user.email, this.user.photoURL, url);
    this.closeModal();
  }

  /** check if user is a friends  */
  public isFriend(fid: string) {
    return isArray(this.friends) && this.friendsIds.includes(fid);
  }

  /** check if user is a friend and follow or unfollow depending on if they are already your friend or not */
  public async manage() {
    if (this.peopleService.friends.includes(this.user.uid)) {
      await this.peopleService.unfollow(this.user.uid);
    } else {
      await this.peopleService.follow(this.user.uid);
    }
  }
}
