import React from 'react';

import { t } from 'i18next';

import { EmailContentRenderer } from '../../2_molecules/EmailContentRenderer/EmailContentRenderer';
import { translations } from '../../../locales/i18n';

export const EmailDuplicateVerifiedPage = () => {
  return (
    <EmailContentRenderer
      metaTitle={t(
        translations.emailNotifications.duplicateVerifiedPage.meta.title,
      )}
      title={t(translations.emailNotifications.duplicateVerifiedPage.title)}
      subtitle={t(
        translations.emailNotifications.duplicateVerifiedPage.subtitle,
      )}
    />
  );
};
