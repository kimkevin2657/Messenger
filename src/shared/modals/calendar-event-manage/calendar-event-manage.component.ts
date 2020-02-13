import { Component, Injector, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import * as moment from 'moment';
import { IUser } from 'src/pages/auth/helpers/model';
import { AuthService } from 'src/pages/auth/services/auth/auth.service';
import { ICalendarEvent } from 'src/pages/dashboard/models/calendar-event';
import { ScheduleService } from 'src/pages/dashboard/services/schedule/schedule.service';
import { Extender } from 'src/shared/helpers/extender';

/** add or edit calendar event */
@Component({
  selector: 'app-calendar-event-manage',
  templateUrl: './calendar-event-manage.component.html',
  styleUrls: ['./calendar-event-manage.component.scss']
})
export class CalendarEventManageComponent extends Extender implements OnInit {
  public event: ICalendarEvent = null;
  public remindTimes = [10, 30, 60, 120, 160, 1440];
  public locations: Location[] = [];
  public user: IUser;
  public showRemind: boolean = false;
  public showNotes: boolean = false;

  constructor(
    protected injector: Injector,
    private navParams: NavParams,
    private authService: AuthService,
    private scheduleService: ScheduleService
  ) {
    super(injector);
  }

  /** get user and get calendar event data. format date to work with the date picker  */
  public async ngOnInit() {
    this.user = await this.authService.getUser();

    const calData = this.navParams.get('data');
    if (calData.data) {
      this.event = calData.data;
      this.event.start = new Date(+this.event.start).toISOString();
      this.event.end = new Date(+this.event.end).toISOString();
    } else {
      this.event = {
        recurrence: [{}],
        start: new Date(calData.day.date).toISOString(),
        end: new Date(calData.day.date).toISOString(),
        title: '',
        uid: this.user.uid
      };
    }
  }

  /** humanize date using moment */
  public getHumanize(time: moment.DurationInputArg1) {
    return moment.duration(time, 'minutes').humanize(true);
  }

  /** add a reminder to calendar event object */
  public addReminder() {
    this.event.recurrence.push({});
  }

  /** remove a reminder from calendar event object */
  public removeReminder(i: number) {
    this.event.recurrence.splice(i, 1);
  }

  /** format event dates and reminders and save or update event */
  public async save() {
    this.event.recurrence =
      this.event.recurrence && this.event.recurrence.length > 0
        ? this.event.recurrence.map((reminder) =>
            moment(this.event.start)
              .subtract(reminder, 'minutes')
              .toISOString()
          )
        : [];
    if (this.event.id) {
      this.scheduleService.updateEvent(this.event).then();
    } else {
      this.scheduleService.addEvent(this.event).then();
    }
    this.closeModal(this.event);
  }
}
