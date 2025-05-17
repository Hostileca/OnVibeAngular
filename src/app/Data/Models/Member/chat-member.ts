import {ChatRole} from './chat-role';

export interface ChatMember {
  userId: string;
  chatId: string;
  joinDate: Date;
  role: ChatRole;
}
