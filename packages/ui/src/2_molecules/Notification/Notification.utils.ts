import { IconNames } from '../../1_atoms';
import { NotificationType } from './Notification.types';

export const getIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.success:
      return IconNames.SUCCESS_ICON;
    case NotificationType.warning:
      return IconNames.WARNING;
    case NotificationType.info:
      return IconNames.INFO;
    case NotificationType.error:
      return IconNames.FAILED_TX;
  }
};
