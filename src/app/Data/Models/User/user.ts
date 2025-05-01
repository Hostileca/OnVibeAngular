export interface User {
  id: string;
  username: string;
  bio: string | null;
  createdAt: Date;
  role: number;
  dateOfBirth: string | null;
  city: string | null;
  country: string | null;
  postsCount: number;
  subscribersCount: number;
  subscriptionsCount: number;
  isSubscribed: boolean;
}
