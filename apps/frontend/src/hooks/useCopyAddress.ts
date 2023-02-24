import { useCallback } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { NotificationType } from '@sovryn/ui';

import { useNotificationContext } from '../contexts/NotificationContext';
import { translations } from '../locales/i18n';

export const useCopyAddress = () => {
  const { addNotification } = useNotificationContext();

  return useCallback(() => {
    addNotification({
      type: NotificationType.success,
      title: t(translations.copyAddress),
      content: '',
      dismissible: true,
      id: nanoid(),
    });
  }, [addNotification]);
};
