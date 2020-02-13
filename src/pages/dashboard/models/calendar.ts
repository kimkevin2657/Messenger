import * as moment from 'moment';
import { DayStatus, IDay } from './day.model';

export class ICalendar {
  constructor(
    public year: number,
    public month: number,
    public events: any[] = [],
    private _days: IDay[] = []
  ) {
    if (_days.length > 0) {
      return;
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < daysInMonth + 1; i++) {
      const calEvents: any[] = [];
      const date = new Date(year, month, i);
      const dayInWeek = date.getDay();
      if (events && events.length > 0) {
        events.forEach((eventItem) => {
          const _eventItem = { ...eventItem };
          const start = moment(eventItem.start).startOf('day');
          const end = moment(eventItem.start).endOf('day');
          if (moment(date).isBetween(start, end, null, '[]')) {
            calEvents.push(_eventItem);
          }
        });
      }
      this._days.push({
        dayInMonth: i,
        dayInWeek,
        date,
        status: DayStatus.Open,
        events: calEvents.length > 0 ? calEvents : []
      });
    }
  }

  get currentDay() {
    return this._days.find((d) => d.dayInMonth === new Date().getDate());
  }

  get days() {
    return [...this._days];
  }
}
