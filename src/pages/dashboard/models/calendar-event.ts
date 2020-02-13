export interface ICalendarEvent {
  title: string;
  description?: string;
  start: string | number | Date;
  end?: string | number | Date;
  recurrence?: any[];
  url?: string;
  isComplete?: boolean;
  remindMe?: boolean;
  createdAt?: Date;
  id?: any;
  uid?: any;
  contact?: Account;
}
