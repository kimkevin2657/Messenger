import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Extender } from 'src/shared/helpers/extender';
import { FirestoreService } from 'src/shared/services/firestore/firestore.service';
import { ICalendarEvent } from '../../models/calendar-event';

/**
 * crud methods to interact with firebase cloud store regarding calendar events
 */
@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends Extender {
  constructor(protected injector: Injector, private firestoreService: FirestoreService) {
    super(injector);
  }

  /** get user events by querying for user id in collection item */
  public getUserEvents(uid: string): Observable<any> {
    return this.firestoreService.colWithIds$('events', (ref) => ref.where('uid', '==', uid));
  }

  /** get all events */
  public getEvent(id: string) {
    return this.firestoreService.doc$(`events/${id}`);
  }

  /** add new calendar event, format dates appropriately */
  public addEvent(data: ICalendarEvent) {
    data.start = Date.parse(data.start as string);
    data.end = Date.parse(data.end as string);
    return this.firestoreService.add('events', data);
  }

  /** update calendar event, format dates appropriately */
  public updateEvent(data: ICalendarEvent) {
    data.start = !Number(data.start) ? Date.parse(data.start as string) : data.start;
    data.end = !Number(data.end) ? Date.parse(data.end as string) : data.end;
    return this.firestoreService.update<ICalendarEvent>(`events/${data.id}`, data);
  }

  /** remove calendar event */
  public removeEvent(id: string) {
    return this.firestoreService.delete(`events/${id}`);
  }
}
