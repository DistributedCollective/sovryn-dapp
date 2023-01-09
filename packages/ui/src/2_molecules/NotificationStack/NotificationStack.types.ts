import { ReactNode } from 'react';

import { NotificationType } from '../Notification/Notification.types';

export type NotificationItem = {
  className?: string;
  dataAttribute?: string;
  content?: ReactNode;
  type?: NotificationType;
  title: string;
  dismissible?: boolean;
  id: number | string;
};
