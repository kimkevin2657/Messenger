import { AfterViewInit, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[elastic-textarea]'
})
export class ElasticDirective implements AfterViewInit {
  /** store element reference of directive */
  public target: any;

  @Input('elastic-textarea') private height: number = 44;

  constructor(private el: ElementRef) {
    this.target = el.nativeElement;
  }

  /** on input event, recalculate height of textarea */
  @HostListener('input', ['$event.target'])
  public onInput(nativeElement: any): void {
    nativeElement.style.overflow = 'hidden';
    nativeElement.style.height = nativeElement.scrollHeight > this.height ? nativeElement.scrollHeight + 'px' : this.height + 'px';
  }

  /** after view initializes, recalculate height of textarea */
  public ngAfterViewInit(): void {
    this.onInput(this.target);
  }
}
