import { IUser } from 'src/pages/auth/helpers/model';

export interface IMessage {
  id?: string;
  participants?: IUser[];
  participantsId: string[] | number[];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  isRead?: boolean;
  isArchieved?: boolean;
  selected?: boolean;
  messages: IChat[];
  uid: string;
}

export interface IChat {
  value: string | string[];
  images?: string[];
  imagesUrl?: any[];
  sendAt: any;
  type: number;
  uid: string;
}

export enum CHAT_TYPES {
  TEXT,
  AUDIO,
  IMAGE,
  IMAGE_GROUP,
}
