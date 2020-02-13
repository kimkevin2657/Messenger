import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { MessagesService } from 'src/pages/messages/services/messages/messages.service';
import { Extender } from 'src/shared/helpers/extender';
import { ITabView } from 'src/shared/helpers/models';
import { CommonService } from 'src/shared/services/common/common.service';
import { isArray } from 'util';
import { PeopleService } from '../../services/people/people.service';
import { PersonComponent } from '../person/person.component';

/**
 * get list of people fro users collection, group them by first letter of their display names.
 * using a href to scroll to category by letter in the user list.
 * you can follow and unfollow users, call and start message
 */
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent extends Extender implements OnInit {
  /** get people using the app */
  public list: IUser[];

  /** group contacts by first letter of their first names */
  public groupedPeople: Array<{ letter: any; people: IUser[] }> = [];

  /** get current currentUser */
  public currentUser: IUser;

  /** stores string array of alphabets */
  public alpha: string[] = [];

  /** stores tabbed views properties */
  public views: ITabView[] = [];

  /** toggles search bar in template */
  public openSearch: boolean = false;

  public selectedIndex: number = 0;
  public friends: any;

  /** references content area of content page */
  @ViewChild('content', null) public content: ElementRef;
  @ViewChild('callNumber', null) public callNumber: ElementRef;

  constructor(
    protected injector: Injector,
    private authService: AuthService,
    private messageService: MessagesService,
    private peopleService: PeopleService,
    private commonService: CommonService
  ) {
    super(injector);
    this.alpha = this.peopleService.alpha;
    this.views = this.peopleService.views;
  }

  /** get currentUser, get users friends ids and get all users from user collection */
  public async ngOnInit() {
    this.loading = true;
    this.openProfileFromUrl();
    this.currentUser = await this.authService.getUser();
    this.subscriptions.push(this.peopleService.getFriendIds(this.currentUser.uid).subscribe((ids) => (this.friends = ids)));
    this.subscriptions.push(
      this.peopleService.getPeople(this.currentUser.uid).subscribe(
        (users) => {
          this.list = users;
          this.loading = false;
          this.showList(this.selectedIndex);
        },
        (err) => {
          this.loading = false;
          this.toast(err);
        }
      )
    );
  }

  /** if you navigate to this page with query params, open person modal and use id in query param to find user details */
  public openProfileFromUrl() {
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((param) => {
        if (param && param.id) {
          this.open(param.id);
        }
      })
    );
  }

  /** search list of users by name and regroup into alphabet categories */
  public onSearch(val: string): void {
    let people: IUser[];
    if (val && val.trim() !== '') {
      people = this.list.filter((item) => {
        return item.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      people = [...this.list];
    }
    this.groupedPeople = this.peopleService.groupPeople(people);
  }

  /** show either friends or all people based on tab selection */
  public showList(index: number) {
    this.selectedIndex = index;
    if (index === 0) {
      this.groupedPeople = this.peopleService.groupPeople(this.list);
    } else {
      const friends = this.list.filter((user) => (this.friends && this.friends.length > 0 ? this.friends.includes(user.uid) : null));
      this.groupedPeople = this.peopleService.groupPeople(friends);
    }
  }

  /** check if user is a friend and follow or unfollow depending on if they are already your friend or not */
  public async manage(friend: IUser) {
    if (isArray(this.friends) && this.friends.includes(friend.uid)) {
      await this.peopleService.unfollow(friend.uid);
    } else {
      await this.peopleService.follow(friend.uid);
    }
    this.showList(this.selectedIndex);
  }

  public isFriend(fid: string) {
    return isArray(this.friends) && this.friends.includes(fid);
  }

  /** open a persons profile */
  public async open(uid: string) {
    const modal = await this.openModal(PersonComponent, uid, 'custom-modal');
    modal.present();
  }

  /** open action sheet with options for a person selection */
  public async openMore(contact: IUser): Promise<any> {
    const actionSheetCtrl = await this.actionSheetCtrl.create({
      header: this.translate.instant('other.options'),
      buttons: [
        {
          text: this.translate.instant('people-component.unfollow'),
          handler: () => {
            this.manage(contact);
          }
        },
        {
          text: this.translate.instant('people-component.open'),
          handler: () => {
            this.open(contact.uid);
          }
        },
        {
          text: this.translate.instant('people-component.call'),
          handler: () => {
            this.commonService.callUser(contact.mobile || contact.phone, this.callNumber);
          }
        },
        {
          text: this.translate.instant('people-component.chat'),
          handler: () => {
            this.messageService.startChat(contact);
          }
        },
        {
          text: this.translate.instant('other.cancel'),
          role: 'cancel'
        }
      ]
    });
    await actionSheetCtrl.present();
  }

  /** scroll user to user group category */
  public scrollTo(item: string): void {
    const element = document.getElementById(item);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }
}
