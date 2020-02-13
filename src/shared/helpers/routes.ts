/** configure all routes strings within the app, makes it easy to change in one place */

export class Routes {
  public static _routes: IRoutes = {
    home: '/',
    auth: '/auth',
    login: '/auth/login',
    register: '/auth/register',
    forgot: '/auth/forgot',
    verifyEmail: '/auth/verify-email',
    deactivated: '/auth/deactivated',
    feed: '/feed',
    profile: '/profile',
    search: '/search',
    dashboard: '/dashboard',
    people: '/people',
    messages: '/messages',
    setting: 'setting',
    schedule: '/dashboard/schedule',
    map: '/dashboard/map',
    chart: '/dashboard/chart',
    welcome: '/welcome'
  };
}

export interface IRoutes {
  home: string;
  dashboard: string;
  people: string;
  messages: string;
  setting: string;
  auth: string;
  login: string;
  register: string;
  forgot: string;
  verifyEmail: string;
  deactivated: string;
  feed: string;
  profile: string;
  search: string;
  schedule: string;
  map: string;
  chart: string;
  welcome: string;
}
