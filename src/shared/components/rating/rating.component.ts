import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  /** stores rate information */
  @Input() public rate: number;

  /** changes rating color */
  @Input() public color: string = 'primary';

  /** emit change event */
  @Output() public updateRate: EventEmitter<number> = new EventEmitter<number>();

  /** stores range for rating */
  public range: number[] = [1, 2, 3, 4, 5];

  /** update rate and emit updated value */
  public update(value: number): void {
    this.rate = value;
    this.updateRate.emit(value);
  }
}
