import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[colorLuminance]'
})
export class ColorLuminanceDirective implements AfterViewInit {
  /** get options assigned to element attribute colorLuminance */
  @Input('colorLuminance') public option: { color: string; percent: number; rgbHex: boolean };

  /** if options is not null, generate a color from options and save as background color */
  constructor(private el: ElementRef) {
    if (this.option) {
      this.el.nativeElement.style.backgroundColor = this.colorLuminance(this.option.color, this.option.percent, this.option.rgbHex);
    }
  }

  /** after view is initialized, generate a color from options and save as background color */
  public ngAfterViewInit(): void {
    this.el.nativeElement.style.backgroundColor = this.colorLuminance(this.option.color, this.option.percent, this.option.rgbHex);
  }

  /** calculate color hex code from provided data. */
  public colorLuminance(hex: any, lum: any, type?: any): string {
    if (!type) {
      hex = String(hex).replace(/[^0-9a-f]/gi, '');
      if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      lum = lum || 0;
      let rgb = '#';
      let c;
      let i;
      for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
        rgb += ('00' + c).substr(c.length);
      }
      return rgb;
    } else {
      const num = parseInt(hex.slice(1), 16);
      const amt = Math.round(2.55 * lum);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;
      return (
        '#' +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      );
    }
  }
}
