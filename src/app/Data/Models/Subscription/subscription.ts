import {User} from '../User/user';

export interface Subscription {
  user: User;
  isSubscribed: boolean;
  subscribedToId: string;
  subscribedById: string;
}
