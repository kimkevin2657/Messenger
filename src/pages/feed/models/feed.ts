import { IUser } from 'src/pages/auth/helpers/model';
import { IComment } from './comment';

export interface IFeed {
  title?: string;
  subtitle?: string;
  content?: string;
  images?: any;
  location?: string;
  createdAt?: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
  id?: any;
  uid?: any;
  user?: IUser;
  likes?: string[];
  userLiked?: boolean;
  comments?: IComment[];
}
