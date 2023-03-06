import React from 'react';

import { t } from 'i18next';

import { EmailContentRenderer } from '../../2_molecules/EmailContentRenderer/EmailContentRenderer';
import { translations } from '../../../locales/i18n';

export const EmailUnsubscribedAllPage = () => {
  return (
    <EmailContentRenderer
      metaTitle={t(
        translations.emailNotifications.unsubscribedAllPage.meta.title,
      )}
      title={t(translations.emailNotifications.unsubscribedAllPage.title)}
      subtitle={t(translations.emailNotifications.unsubscribedAllPage.subtitle)}
    />
  );
};
