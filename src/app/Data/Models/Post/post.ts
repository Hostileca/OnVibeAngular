import {UserShort} from '../User/user-short';

export interface Post {
  id: string;
  content?: string;
  date: Date;
  owner: UserShort;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  attachmentsIds: string[];
}
