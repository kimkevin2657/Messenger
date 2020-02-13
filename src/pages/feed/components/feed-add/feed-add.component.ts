import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { ImagePreviewComponent } from 'src/shared/modals/image-preview/image-preview.component';
import { CommonService } from 'src/shared/services/common/common.service';
import { FirestoreService } from 'src/shared/services/firestore/firestore.service';
import { isArray } from 'util';
import { IFeed } from '../../models/feed';
import { FeedService } from '../../services/feed/feed.service';

/**
 * allows the user to edit or add new post, browse, select and store images to firebase storage
 */
@Component({
  selector: 'app-feed-add',
  templateUrl: './feed-add.component.html',
  styleUrls: ['./feed-add.component.scss']
})
export class FeedAddComponent extends Extender implements OnInit {
  public currentUser: IUser;
  public feed: IFeed;
  public images: any = [];
  public tempImages: any = [];
  public more: boolean;
  public feedOptions = [
    {
      icon: 'camera',
      click: () => {
        this.openImageOptions();
      }
    },
    {
      icon: 'check-square',
      click: () => {
        this.more = !this.more;
      }
    }
  ];
  @ViewChild('fileInputButton', null) private fileInputButton: ElementRef;

  constructor(
    protected injector: Injector,
    private navParams: NavParams,
    private authService: AuthService,
    private commonService: CommonService,
    private feedService: FeedService,
    private firestoreService: FirestoreService
  ) {
    super(injector);
  }

  /** get current user, get id from navParam, if id present get data for feed, if no id set default data */
  public async ngOnInit() {
    this.currentUser = await this.authService.getUser();
    const id = this.navParams.get('data');
    if (!id) {
      this.feed = {
        id: this.firestoreService.createId(),
        content: '',
        images: [],
        subtitle: '',
        title: '',
        uid: this.currentUser.uid
      };
    } else {
      this.subscriptions.push(
        this.feedService.getPost(id, this.currentUser.uid).subscribe((feed) => {
          this.feed = feed;
          this.images = this.feed.images;
        })
      );
    }
  }

  /** open options for image upload */
  public async openImageOptions(): Promise<any> {
    const actionSheetCtrl = await this.actionSheetCtrl.create({
      header: this.translate.instant('feed-add-component.image-option-header'),
      buttons: [
        {
          text: this.translate.instant('feed-add-component.image-option-library'),
          handler: () => {
            this.getPictures(0, true);
          }
        },
        {
          text: this.translate.instant('feed-add-component.image-option-camera'),
          handler: () => {
            this.getPictures(1);
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

  /** open options on image selection, present actionsheet to delete or open image */
  public async doMoreOnImage(image: string, index: number): Promise<any> {
    const actionSheetCtrl = await this.actionSheetCtrl.create({
      header: this.translate.instant('other.options'),
      buttons: [
        {
          text: this.translate.instant('other.open-label'),
          handler: () => {
            this.openImage(image);
          }
        },
        {
          text: this.translate.instant('other.delete-label'),
          handler: () => {
            this.removeImage(index);
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

  /** used for browser image uploads, hooked up to input file type on change event */
  public detectFiles(event: any) {
    this.commonService.getImagesFromFiles(event).then((images) => {
      this.checkAndSaveImages(images);
    });
  }

  /** remove uploaded images */
  public removeImage(index: number): void {
    this.firestoreService.deleteUpload(this.images[index]);
    this.images.splice(index, 1);
  }

  /** preview image in modal */
  public async openImage(image: string) {
    const modal = await this.openModal(ImagePreviewComponent, image, 'custom-modal');
    modal.present();
  }

  /** save feed and feed images */
  public async save() {
    this.loading = true;
    if (!this.feed.images || (!this.feed.images && !isArray(this.feed.images))) {
      this.feed.images = [];
    }
    this.uploadImage(this.tempImages).then(async (images: string[]) => {
      this.feed.images = this.feed.images.concat(images);

      await this.feedService.upsertPost(this.feed).then(
        (_data) => {
          this.loading = false;
          this.closeModal();
        },
        (error) => this.toast(error)
      );
    });
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
      await this.checkAndSaveImages(imageData);
    } else {
      // if on device use browser file upload
      (this.fileInputButton.nativeElement as HTMLInputElement).click();
    }
  }

  /** remove images from input file for browser only
   * store images or send a toast id no image found
   */
  private async checkAndSaveImages(imageData: any[]) {
    this.loading = false;
    (this.fileInputButton.nativeElement as HTMLInputElement).value = null;
    if (imageData.length > 0) {
      this.tempImages = imageData;
      this.images = this.images.concat(this.tempImages);
    } else {
      this.toast(this.translate.instant('message.component.no-images-selected'));
    }
  }

  /**
   * append base 64 string to image data, upload image data to firebase storage.
   * the upload function returns a download data which is then saved to images
   */
  private async uploadImage(imageData: string[]) {
    this.images = imageData;
    const read$ = [];
    this.images.forEach((i: string) => {
      read$.push(this.firestoreService.uploadImage(i, `${Date.now()}-${this.currentUser.uid}`, `feed-images-${this.feed.id}`));
    });

    try {
      const res = await Promise.all(read$);
      this.loading = false;
      return res;
    } catch (err) {
      return this.failPromise(err);
    }
  }

  private failPromise = (err: any) => {
    this.loading = false;
    this.toast(err);
  };
}
