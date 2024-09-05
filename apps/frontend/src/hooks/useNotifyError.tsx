import { useCallback } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { NotificationType } from '@sovryn/ui';

import { useNotificationContext } from '../contexts/NotificationContext';
import { translations } from '../locales/i18n';

export const useNotifyError = () => {
  const { addNotification } = useNotificationContext();

  const notifyError = useCallback(
    (error: Error) => {
      addNotification({
        type: NotificationType.error,
        title: t(translations.common.somethingWentWrong),
        content: error.message,
        dismissible: true,
        id: nanoid(),
      });
    },
    [addNotification],
  );

  return { notifyError };
};
