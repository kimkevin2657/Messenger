import { AfterContentChecked, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { messages } from 'src/assets/data/message';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { SettingService } from 'src/pages/setting/services/setting/setting.service';
import { INoData } from 'src/shared/components/no-data/no-data.component';
import { Extender } from 'src/shared/helpers/extender';
import { GalleryPickerComponent } from 'src/shared/modals/gallery-picker/gallery-picker.component';
import { ImagePreviewComponent } from 'src/shared/modals/image-preview/image-preview.component';
import { CommonService } from 'src/shared/services/common/common.service';
import { FirestoreService } from 'src/shared/services/firestore/firestore.service';
import { CHAT_TYPES, IChat, IMessage } from '../../models/message';
import { MessagesService } from '../../services/messages/messages.service';

/**
 * send messages between users. as a user, you can deactivate autoreply in setting page.
 * or remove autoreply method and all calls to it.
 * sending a message updates messages.message property with the latest message.
 * a function in firebase cloud functions checks every message update and sends a push notification to the device
 * check readme for info on cloud functions
 */
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent extends Extender implements OnInit, AfterContentChecked {
  public message: IMessage;
  public currentUser: IUser;
  public chat: IChat[] = [];
  public chatType = CHAT_TYPES;
  public textMsg: string = '';
  public images: string[] = [];
  public sendLoading: boolean;
  public noDataconfig: INoData = {
    content: { title: 'Its quite here', description: 'start a conversation' }
  };
  @ViewChild('content', null) public content: ElementRef;
  @ViewChild('callNumber', null) public callNumber: ElementRef;
  @ViewChild('fileInputButton', null) private fileInputButton: ElementRef;

  constructor(
    protected injector: Injector,
    private navParams: NavParams,
    private authService: AuthService,
    private commonService: CommonService,
    private firestoreService: FirestoreService,
    private messageService: MessagesService,
    private settingService: SettingService
  ) {
    super(injector);
  }

  public async ngOnInit() {
    this.loading = true;
    this.currentUser = await this.authService.getUser();
    this.subscriptions.push(
      this.messageService.getMessage(this.navParams.get('data')).subscribe(
        (msg) => {
          this.message = msg;
          this.chat = this.message.messages;
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          this.toast(err);
        }
      )
    );
  }

  /** scroll to bottom when view loads with messages */
  public ngAfterContentChecked() {
    this.scrollToBottom();
  }

  /**
   * used in template to retrieve details of receiving user for the message
   * if currentUser's id doesn't match another user in list, get the other users data as a recipient
   */
  public getSender(message: IMessage) {
    return message ? message.participants.find((user: IUser) => user.uid !== this.currentUser.uid) : null;
  }

  /**
   * used in template to retrieve details of receiving user for the message
   * if currentUser's id match another user in list, get the other users data as a recipient
   */
  public getRecipient(message: IMessage) {
    return message ? message.participants.find((user: IUser) => user.uid === this.currentUser.uid) : null;
  }

  /** call sender user */
  public call() {
    this.commonService.callUser(this.getSender(this.message).mobile || this.getSender(this.message).phone, this.callNumber);
  }

  /** on message press show options is action sheet */
  public async onMessageHold(data: IChat) {
    if (data.uid === this.currentUser.uid) {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Chat Options',
        buttons: [
          {
            text: 'Delete',
            role: 'Destructive',
            handler: () => {
              this.messageService
                .deleteChat(this.message, data)
                .then(() => this.scrollToBottom())
                .catch((err) => this.failPromise(err));
            }
          },
          {
            text: 'Close',
            role: 'cancel',
            handler: () => {}
          }
        ]
      });
      await actionSheet.present();
    }
  }

  /** send message, update uid property of message, this is needed to find the sender id and send notifications to recipients via firebase cloud functions */
  public send(text: any, images = null) {
    const data: IChat = {
      images,
      value: text,
      type: this.chatType.TEXT,
      sendAt: Date.now(),
      uid: this.currentUser.uid
    };
    this.sendLoading = true;
    if (text) {
      this.messageService
        .send({ ...this.message }, data)
        .then(() => {
          this.textMsg = '';
          this.sendLoading = false;
         // this.autoReply(messages[this.getRandomInt(1, 50)]);
        })
        .catch((err) => this.failPromise(err));
    }
  }

  /** for browser input file on change, run this method to get base64 string of files
   * and open gallery modal with the images
   */
  public detectFiles(event: any) {
    this.commonService.getImagesFromFiles(event).then((images) => {
      this.openGallery(images);
    });
  }

  /**
   * open action sheet with photo upload options, either from camera or library
   * and run getPictures method
   */
  public async sendPhoto() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Send Images',
      buttons: [
        {
          text: 'Use Camera',
          handler: () => {
            this.getPictures(1);
          }
        },
        {
          text: 'Use Library',
          handler: () => {
            this.getPictures(0, true);
          }
        },
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }

  /** open preview image modal */
  public async preview(image: string) {
    const modal = await this.openModal(ImagePreviewComponent, image);
    modal.present();
  }

  /** auto reply to message */
  public autoReply(text: any, images = null) {
    if (this.settingService.setting.autoReply === true) {
      setTimeout(() => {
        const data: IChat = {
          images,
          value: text,
          type: this.chatType.TEXT,
          sendAt: Date.now(),
          uid: this.getSender(this.message).uid
        };
        this.loading = true;
        this.messageService
          .send({ ...this.message }, data)
          .then(() => (this.loading = false))
          .catch((err) => this.failPromise(err));
      }, 6000);
    }
  }

  /**
   * scroll to bottom of chat
   */
  public scrollToBottom(): void {
    const element = document.getElementById('last-item');
    if (element) {
      element.scrollIntoView({
        behavior: 'auto',
        block: 'end',
        inline: 'nearest'
      });
    }
  }

  /**
   * get image using native camera plugin to retrieve from either camera or library of device
   * param type is a number that specifies whether to get from camera or from library
   * one image retrieved, upload to firebase storage. if error, display a toast with error message
   */
  private async getPictures(type: number, multiple = false) {
    let imageData = [];
    this.loading = true;

    if ((window as any).cordova) {
      // if on device use native plugins
      imageData = await this.commonService.getPictures(type, multiple);
      await this.openGallery(imageData);
    } else {
      // if on device use browser file upload
      (this.fileInputButton.nativeElement as HTMLInputElement).click();
    }
  }

  /** open gallery with image files, on dismiss modal, get images and upload them */
  private async openGallery(imageData: any[]) {
    if (imageData.length > 0) {
      const modal = await this.openModal(GalleryPickerComponent, imageData, 'custom-modal');
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data.images && data.images.length > 0) {
        this.uploadImage(data.text, data.images);
      } else {
        this.toast(this.translate.instant('message.component.no-images-selected'));
      }
    }
    (this.fileInputButton.nativeElement as HTMLInputElement).value = null;
  }

  /**
   * append base 64 string to image data, upload image data to firebase storage.
   * the upload function returns a download data which is then saved to images
   */
  private uploadImage(text: string, imageData: string[]) {
    this.images = imageData;
    const read$ = [];
    this.images.forEach((i) => {
      read$.push(this.firestoreService.uploadImage(i, `${Date.now()}-${this.currentUser.uid}`, 'chat-images'));
    });

    Promise.all(read$)
      .then((res) => {
        this.images = res;
        this.send(text, this.images);
        this.loading = false;
      })
      .catch((err) => this.failPromise(err));
  }

  private failPromise = (err: any) => {
    this.loading = false;
    this.sendLoading = false;
    this.toast(err);
  };
}
