import { useCallback } from 'react';

import { nanoid } from 'nanoid';

import { NotificationType } from '@sovryn/ui';

import { useNotificationContext } from '../contexts/NotificationContext';
import { translations } from '../locales/i18n';

export const useCopyAddress = () => {
  const { addNotification } = useNotificationContext();

  return useCallback(() => {
    addNotification({
      type: NotificationType.success,
      title: translations.copyAddress,
      content: '',
      dismissible: true,
      id: nanoid(),
    });
  }, [addNotification]);
};
