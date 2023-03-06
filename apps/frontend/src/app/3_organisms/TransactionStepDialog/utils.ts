import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { NotificationType, StatusType } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';

export const handleNotification = (
  type: NotificationType,
  title: string,
  content?: string,
) => ({
  type,
  id: nanoid(),
  title: t(title),
  content: content ? t(content) : '',
  dismissible: true,
});

export const renderNotification = (txStatus: StatusType) => {
  const {
    transactionSuccessTitle: titleSuccess,
    transactionFailedTitle: titleError,
    transactionFailedSubtitle: subtitleError,
  } = translations.transactionStep;

  const [title, subtitle] =
    txStatus === StatusType.success
      ? [titleSuccess]
      : [titleError, subtitleError];

  const type =
    txStatus === StatusType.success
      ? NotificationType.success
      : NotificationType.error;

  return handleNotification(type, title, subtitle);
};
