import { useCallback } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { NotificationType } from '@sovryn/ui';

import { useNotificationContext } from '../contexts/NotificationContext';
import { translations } from '../locales/i18n';

export const useClipboard = () => {
  const { addNotification } = useNotificationContext();

  const write = useCallback(
    async (value: string) => {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        addNotification({
          type: NotificationType.success,
          title: t(translations.copyValue),
          content: '',
          dismissible: true,
          id: nanoid(),
        });
      }
    },
    [addNotification],
  );

  const read = useCallback(async () => {
    if (navigator.clipboard) {
      return await navigator.clipboard.readText();
    }
    return '';
  }, []);

  return { write, read };
};
