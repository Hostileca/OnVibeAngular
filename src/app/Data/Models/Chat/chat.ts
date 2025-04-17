import {ChatMember} from '../Member/chat-member';
import {Message} from '../Message/message';

export interface Chat {
  id: string;
  name: string;
  preview: Message
  members: ChatMember[];
}
