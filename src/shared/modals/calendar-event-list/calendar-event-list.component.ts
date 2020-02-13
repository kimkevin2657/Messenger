import { Component, Injector, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ICalendarEvent } from 'src/pages/dashboard/models/calendar-event';
import { IDay } from 'src/pages/dashboard/models/day.model';
import { ScheduleService } from 'src/pages/dashboard/services/schedule/schedule.service';
import { Extender } from 'src/shared/helpers/extender';
import { CalendarEventManageComponent } from '../calendar-event-manage/calendar-event-manage.component';

/**
 * get events for a selected day from calendar component
 */
@Component({
  selector: 'app-calendar-event-list',
  templateUrl: './calendar-event-list.component.html',
  styleUrls: ['./calendar-event-list.component.scss']
})
export class CalendarEventListComponent extends Extender implements OnInit {
  public day: any;
  public events: ICalendarEvent[] = [];
  constructor(protected injector: Injector, private navParam: NavParams, private scheduleService: ScheduleService) {
    super(injector);
  }

  /** get events from nav params */
  public ngOnInit() {
    this.day = this.navParam.get('data');
    this.events = this.day.data.events;
  }

  /** open calendar event manage to edit event and on dismiss, add or replace event in events list */
  public async open(day: IDay, data: ICalendarEvent = null, index: number) {
    const modal = await this.openModal(CalendarEventManageComponent, { day, data });
    modal.present();
    modal.onDidDismiss().then((item) => {
      if (item.data && !item.data.id) {
        this.events.push(item.data);
      } else if (item.data && !item.data.id) {
        this.events.splice(index, 1, item.data);
      }
    });
  }

  /** update event as completed */
  public async updateAsCompleted(event: ICalendarEvent, index: number) {
    await this.scheduleService.updateEvent(event);
    this.events.splice(index, 1, event);
  }

  /** delete event */
  public delete(item: ICalendarEvent, index: number) {
    this.scheduleService.removeEvent(item.id);
    this.events.splice(index, 1);
  }
}
