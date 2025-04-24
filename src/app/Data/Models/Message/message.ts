import {UserShort} from '../User/user-short';

export interface Message {
  id: string;
  text: string;
  attachmentsIds: string[];
  sender: UserShort;
  date: Date;
}
