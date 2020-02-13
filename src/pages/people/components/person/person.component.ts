import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { MessagesService } from 'src/pages/messages/services/messages/messages.service';
import { Extender } from 'src/shared/helpers/extender';
import { CommonService } from 'src/shared/services/common/common.service';
import { PeopleService } from '../../services/people/people.service';

/**
 * view users profile and call, follow, unfollow share or chat to user
 */
@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent extends Extender implements OnInit {
  public user: IUser;
  public currentUser: IUser;
  @ViewChild('callNumber', null) public callNumber: ElementRef;

  constructor(
    protected injector: Injector,
    private navParams: NavParams,
    private authService: AuthService,
    private peopleService: PeopleService,
    private messageService: MessagesService,
    private commonService: CommonService
  ) {
    super(injector);
  }

  /** get current user, get user to view by getting id from nav param */
  public async ngOnInit() {
    this.currentUser = await this.authService.getUser();
    const uid = this.navParams.get('data');
    this.user = await this.peopleService.getPerson(uid);
  }

  /** call user */
  public async call() {
    await this.commonService.callUser(this.user.mobile || this.user.phone, this.callNumber);
    this.closeModal();
  }

  /** chat to user */
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

  /** getter to check if user is a friend */
  public get isFriend() {
    return this.peopleService.friends.includes(this.user.uid);
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
