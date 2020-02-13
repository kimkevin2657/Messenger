import { Component, Injector, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { IChat, IMessage } from '../../models/message';
import { MessagesService } from '../../services/messages/messages.service';
import { MessageComponent } from '../message/message.component';

/**
 * view users messages, manage messages.
 */
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent extends Extender implements OnInit {
  public allMessages: IMessage[] = [];
  public messages: IMessage[] = [];
  public currentUser: IUser;
  public getSelection: boolean = false;
  public openSearch: boolean = false;
  public view$ = new Subject<boolean>();
  /** get tab data to use as input for app-tab-menu component */
  public views: IViews[] = [
    {
      id: 0,
      active: true,
      name: this.translate.instant('messages-component.tab-all'),
      event: () => {
        this.view$.next(false);
      }
    },
    {
      id: 2,
      name: this.translate.instant('messages-component.tab-archived'),
      event: () => {
        this.view$.next(true);
      }
    }
  ];

  constructor(protected injector: Injector, private authService: AuthService, private messageService: MessagesService) {
    super(injector);
  }

  /**
   * subscribe to view change events from tab component changes,
   * create a switch map to get data based on view change
   * if isArchieved view is clicked show archieved messages
   * emit event for no archieved messages on initialization
   */
  public async ngOnInit() {
    this.currentUser = await this.authService.getUser();
    const queryObservable = this.view$.pipe(switchMap((view) => this.messageService.getMessages(this.currentUser.uid, view)));
    this.subscriptions.push(
      queryObservable.subscribe((queryItems) => {
        this.messages = this.allMessages = queryItems;
      })
    );
    this.view$.next(false);
  }

  /** on view enter, if route contains an id, open chat belonging to that id in a modal straight away */
  public ionViewDidEnter() {
    const messageId = this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.id;

    if (messageId) {
      this.openChat(messageId);
    }
  }

  /** search messages by participant name */
  public onSearch(val: string): void {
    if (val && val.trim() !== '') {
      this.messages = this.allMessages.filter((item) => {
        return item.participants.find((user) => user.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.messages = this.allMessages;
    }
  }

  /** used in template to retrieve details of receiving user for the message
   * if currentUser's id doesn't match another user in list, get the other users data as a recipient
   */
  public getSender(message: IMessage) {
    return message.participants.find((user: IUser) => user.uid !== this.currentUser.uid);
  }

  /** get last message sent in conversation or default to start chatting */
  public getLastMessage(message: IMessage): IChat | { value: string } {
    return message.messages && message.messages.length > 0 ? message.messages[message.messages.length - 1] : null;
  }

  /** open chat in a model */
  public async openChat(message: string) {
    const modal = await this.openModal(MessageComponent, message);
    modal.present();
  }

  /** action sheet with options for a single chat,
   * allow user to mark message as read, archive chat and delete a chat
   */
  public async options(chat: IMessage) {
    const asCtrl = await this.actionSheetCtrl.create({
      header: this.translate.instant('messages-component.manage-chat'),
      buttons: [
        {
          text: this.translate.instant('messages-component.mark-as-read'),
          handler: () => {
            chat.isRead = true;
            this.messageService.updateMessage(chat);
          }
        },
        {
          text: this.translate.instant('messages-component.archieved'),
          handler: () => {
            chat.isArchieved = true;
            this.messageService.updateMessage(chat);
          }
        },
        {
          text: this.translate.instant('messages-component.delete'),
          handler: () => {
            this.messageService.deleteMessage(chat);
          }
        },
        {
          text: this.translate.instant('other.close'),
          role: 'cancel'
        }
      ]
    });
    asCtrl.present();
  }

  /** action sheet with options for selected chat,
   * allow user to mark message as read, archive chat and delete a chat
   */
  public async messagesOptions() {
    const asCtrl = await this.actionSheetCtrl.create({
      header: this.translate.instant('messages-component.manage-messages'),
      buttons: [
        {
          text: this.translate.instant('messages-component.select'),
          handler: () => {
            this.getSelection = true;
          }
        },
        {
          text: this.translate.instant('messages-component.select-all'),
          handler: () => {
            this.selectAll();
          }
        },
        {
          text: this.translate.instant('messages-component.delete-all'),
          handler: () => {
            this.messageService.deleteAllMessages(this.messages.length);
          }
        },
        {
          text: this.translate.instant('other.close'),
          role: 'cancel'
        }
      ]
    });
    asCtrl.present();
  }

  /** mark multiple selected messages as read */
  public markAsRead() {
    const selected = this.messages.filter((msg) => msg.selected === true);
    selected.forEach((item) => {
      item.isRead = true;
      this.messageService.updateMessage(item);
    });
    this.getSelection = false;
  }

  /** archive multiple messages */
  public archieve() {
    const selected = this.messages.filter((msg) => msg.selected === true);
    selected.forEach((item) => {
      item.isArchieved = true;
      this.messageService.updateMessage(item);
    });
    this.getSelection = false;
  }

  /** delete selected messages */
  public deleteSelected() {
    const selected = this.messages.filter((msg) => msg.selected === true);
    selected.forEach((item) => {
      this.messageService.deleteMessage(item);
    });
    this.getSelection = false;
  }

  /** select all messages */
  private selectAll() {
    this.getSelection = true;
    this.messages.map((message) => {
      message.selected = true;
      return message;
    });
  }
}

interface IViews {
  id: number;
  name: string;
  active?: boolean;
  event?: any;
}
