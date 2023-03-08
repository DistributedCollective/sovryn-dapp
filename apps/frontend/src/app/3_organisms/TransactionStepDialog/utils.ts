import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { NotificationType, StatusType } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';

export const handleNotification = (
  type: NotificationType,
  title: string,
  content = '',
  className = 'text-xs',
) => ({
  type,
  id: nanoid(),
  title: t(title),
  content: t(content),
  dismissible: true,
  className,
});

export const renderNotification = (txStatus: StatusType) => {
  const [title, subtitle] =
    txStatus === StatusType.success
      ? [translations.transactionStep.transactionSuccessTitle]
      : [
          translations.common.tx.failedTitle,
          translations.common.tx.failedSubtitle,
        ];

  const type =
    txStatus === StatusType.success
      ? NotificationType.success
      : NotificationType.error;

  return handleNotification(type, title, subtitle);
};
