export type NotificationUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  email?: string;
  emailNotificationLastSent?: string;
  role: string;
};
