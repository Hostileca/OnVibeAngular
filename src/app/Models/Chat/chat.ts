import {ChatMember} from '../Member/chat-member';

export interface Chat {
  id: string;
  name: string;
  members: ChatMember[];
}
