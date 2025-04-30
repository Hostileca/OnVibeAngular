import {UserShort} from '../User/user-short';

export interface Comment {
  id: string;
  content: string;
  postId: string;
  sender: UserShort;
  date: Date;
}
