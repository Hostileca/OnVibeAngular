export interface User {
  id: string;
  username: string;
  bio?: string;
  createdAt: Date;
  role: number;
  dateOfBirth?: Date;
  city?: string;
  postsCount: number;
  subscribersCount: number;
  subscriptionsCount: number;
  isSubscribed: boolean;
}
