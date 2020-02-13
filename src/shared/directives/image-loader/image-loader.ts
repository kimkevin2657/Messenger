import { Directive, ElementRef, HostListener, Injector, Input, OnChanges, Renderer } from '@angular/core';
import { Extender } from 'src/shared/helpers/extender';
import { ImagePreviewComponent } from 'src/shared/modals/image-preview/image-preview.component';

@Directive({
  selector: '[image-loader]'
})
export class ImageLoaderDirective extends Extender implements OnChanges {
  /** holds image path assigned to attribute */
  @Input('image-loader') public imageLoader: any;
  /** if image should have open preview modal on click */
  @Input('preview') public clickable: boolean = false;

  /** holds element reference of directive */
  public element: any;

  /** gets image spinner from assets and assign to background image set css styles */
  constructor(protected injector: Injector, private el: ElementRef, private renderer: Renderer) {
    super(injector);
    this.element = el.nativeElement;
    this.element.style.backgroundImage = 'url(./assets/images/other/placeholder.png)';
    this.renderer.setElementStyle(this.element, 'background-size', 'cover');
    this.renderer.setElementStyle(this.element, 'background-position', 'center');
    this.renderer.setElementStyle(this.element, 'background-repeat', 'no-repeat');
  }

  /** on changes call _loadImage method */
  public ngOnChanges(changes) {
    if (changes.imageLoader) {
      this._loadImage();
    }
  }

  /** on click event, open preview modal */
  @HostListener('click', ['$event']) private async onClick(event: Event) {
    if (this.clickable) {
      const modal = await this.openModal(ImagePreviewComponent, this.imageLoader, 'custom-modal');
      modal.present();
    }
  }

  /** list on image event 'load' and append new image url to background image, if image is not defined use a placeholder */
  private _loadImage() {
    const image = new Image();
    image.addEventListener('load', () => {
      this.element.style.backgroundImage = `url(${this.imageLoader ? this.imageLoader : '../assets/images/other/placeholder.png'})`;
      this.renderer.setElementStyle(this.element, 'background-size', 'cover');
      this.renderer.setElementStyle(this.element, 'background-color', 'none');
    });

    image.src = this.imageLoader ? this.imageLoader : '../assets/images/other/placeholder.png';
  }
}
