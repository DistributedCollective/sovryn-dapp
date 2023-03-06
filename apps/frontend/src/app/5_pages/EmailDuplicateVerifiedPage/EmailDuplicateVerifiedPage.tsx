import React from 'react';

import { t } from 'i18next';

import { EmailVerificationState } from '../../2_molecules/EmailVerificationState/EmailVerificationState';
import { translations } from '../../../locales/i18n';

export const EmailDuplicateVerifiedPage = () => (
  <EmailVerificationState
    metaTitle={t(
      translations.emailNotifications.duplicateVerifiedPage.meta.title,
    )}
    title={t(translations.emailNotifications.duplicateVerifiedPage.title)}
    subtitle={t(translations.emailNotifications.duplicateVerifiedPage.subtitle)}
  />
);
