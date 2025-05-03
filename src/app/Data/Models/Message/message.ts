import {UserShort} from '../User/user-short';

export interface Message {
  id: string;
  text: string;
  chatId: string;
  attachmentsIds: string[];
  sender: UserShort;
  date: Date;
}
