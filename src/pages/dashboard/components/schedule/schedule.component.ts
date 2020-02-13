import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { Extender } from 'src/shared/helpers/extender';
import { CalendarEventListComponent } from 'src/shared/modals/calendar-event-list/calendar-event-list.component';
import { ICalendar } from '../../models/calendar';
import { ICalendarEvent } from '../../models/calendar-event';
import { IDay } from '../../models/day.model';
import { ScheduleService } from '../../services/schedule/schedule.service';

/**
 * scheduling and calendar events are managed by this component.
 * users can navigate calendar and view events of a day
 */
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent extends Extender implements OnInit {
  /** get all years between 20 years in future and start from 2009 */
  public get years(): number[] {
    const currentYear = moment(new Date())
      .add(20, 'years')
      .year();
    const years = [];
    let startYear = 2009;
    while (startYear <= currentYear) {
      years.push(startYear++);
    }
    return years;
  }
  public user: IUser;
  public months = moment.months();
  public selectedMonth: number = new Date().getMonth();
  public selectedYear: number = new Date().getFullYear();
  public contact: Account;
  public weekDays = moment.weekdays();
  public currentCalendar: ICalendar = new ICalendar(this.selectedYear, this.selectedMonth, []);
  public loading = false;
  public selectedDay: IDay;
  @Input() public items = null;
  @Output() private event: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected injector: Injector, private authService: AuthService, private calendarService: ScheduleService) {
    super(injector);
  }

  /** get user, get user calendar events and build calendar */
  public async ngOnInit() {
    this.loading = true;
    this.user = await this.authService.getUser();
    this.subscriptions.push(
      this.calendarService.getUserEvents(this.user.uid).subscribe(
        (events) => {
          this.items = events;
          this.buildCalendar(this.items, true);
          this.loading = false;
        },
        (err) => {
          this.toast(err);
          this.loading = false;
        }
      )
    );
  }

  /** check if date is a settable date. used in template to disable older dates */
  public getIsSettable(day: IDay) {
    if (day && day.date) {
      return (
        day.date.getTime() <
        new Date(
          moment()
            .subtract(1, 'day')
            .toDate()
        ).getTime()
      );
    }
    return false;
  }

  /** configure rows for the calendar */
  public getRow(index: number, day: { dayInMonth: number; dayInWeek: number }) {
    const startRow = 2;
    const weekRow = Math.floor(index / 7);
    const firstWeekDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
    const irregularRow = day.dayInWeek < firstWeekDayOfMonth ? 1 : 0;

    return startRow + weekRow + irregularRow;
  }

  /** on day change, if user selects another day, open view day to see list of events for that day */
  public onChangeStatus(day: IDay) {
    if (this.getIsSettable(day)) {
      return;
    }
    this.selectedDay = day;
    this.event.next(this.selectedDay);
    this.view(this.selectedDay);
  }
  /** change month drop with get intended month and build calendar.
   * manage month index value to make sure month only falls between 0-11
   */
  public changeMonth(value: number): void {
    if (value > 11) {
      value = 0;
      this.selectedYear = this.selectedYear + 1;
    } else if (value < 0) {
      value = 11;
      this.selectedYear = this.selectedYear - 1;
    }
    this.selectedMonth = value;
    this.buildCalendar(this.items);
  }

  /** get selected year and build calendar */
  public changeYear(value: number): void {
    this.selectedYear = value;
    this.buildCalendar(this.items);
  }

  /** open list of calendar events for selected day */
  public async view(day: IDay): Promise<any> {
    const modal = await this.openModal(CalendarEventListComponent, { data: day });
    await modal.present();
  }

  /** build calendar using ICalendar class */
  private buildCalendar(items: ICalendarEvent[], selectDay = false) {
    this.currentCalendar = new ICalendar(this.selectedYear, this.selectedMonth, items || []);
    if (selectDay) {
      this.selectedDay = this.currentCalendar.currentDay;
    }
  }
}
