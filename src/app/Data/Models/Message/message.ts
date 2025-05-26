import {UserShort} from '../User/user-short';
import {Reaction} from '../Reaction/reaction';

export interface Message {
  id: string;
  text: string;
  chatId: string;
  attachmentsIds: string[];
  sender: UserShort;
  date: Date;
  reactions: Reaction[];
  isRead: boolean;
  userToRead: { [userId: string]: boolean };
}
