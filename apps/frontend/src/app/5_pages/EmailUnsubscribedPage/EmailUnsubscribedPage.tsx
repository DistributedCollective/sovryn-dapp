import React from 'react';

import { t } from 'i18next';

import { EmailContentRenderer } from '../../2_molecules/EmailContentRenderer/EmailContentRenderer';
import { translations } from '../../../locales/i18n';

export const EmailUnsubscribedPage = () => {
  return (
    <EmailContentRenderer
      metaTitle={t(translations.emailNotifications.unsubscribedPage.meta.title)}
      title={t(translations.emailNotifications.unsubscribedPage.title)}
      subtitle={t(translations.emailNotifications.unsubscribedPage.subtitle)}
    />
  );
};
