import {NotificationType} from './notification-type';

export interface Notification {
  id: string;
  date: Date;
  isRead: boolean;
  type: NotificationType;
  updatedEntityId: string;
}
