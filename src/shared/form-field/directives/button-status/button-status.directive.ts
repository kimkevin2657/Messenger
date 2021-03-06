import { Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

const SVG_LOADING = `
    <svg class="spinner" viewBox="0 0 50 50">
      <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
    </svg>`;

@Directive({
  selector: '[btnStatus]'
})
export class ButtonStatusDirective implements OnChanges, OnInit {
  @Input('btnStatus') public status: boolean;
  @Input('loadingText') public loadingText: boolean = true;
  private target: HTMLButtonElement;
  private innerText: string;

  private divElement: any = null;

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  public ngOnChanges(changes: SimpleChanges) {
    this.loadingState(changes.status.currentValue);
  }

  public ngOnInit(): void {
    this.target = this._el.nativeElement;
  }

  /** toggle loader state of button */
  private loadingState(status: boolean) {
    if (status) {
      this.innerText = this.target.innerText;
      this.target.innerText = '';
      this.createLoader(this.target);
    } else {
      this.removeLoader();
    }
    if (this.target) {
      this.target.disabled = this.target ? status : null;
    }
  }

  /** creates a loading for button */
  private createLoader(wrapperElement: HTMLElement): void {
    this.divElement = this._renderer.createElement('div');
    this._renderer.addClass(this.divElement, 'btn-loader');
    this.divElement.innerHTML = (this.loadingText ? 'Loading' : '') + SVG_LOADING;
    this._renderer.insertBefore(wrapperElement, this.divElement, null);
  }

  /** removes loading from button */
  private removeLoader(): any {
    if (this.divElement) {
      this._renderer.removeChild(this.target, this.divElement);
      this.target.innerText = this.innerText;
    }
  }
}
