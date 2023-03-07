import React from 'react';

import { t } from 'i18next';

import { EmailVerificationState } from '../../2_molecules/EmailVerificationState/EmailVerificationState';
import { translations } from '../../../locales/i18n';

export const EmailVerifiedPage = () => (
  <EmailVerificationState
    metaTitle={t(translations.emailNotifications.verifiedPage.meta.title)}
    title={t(translations.emailNotifications.verifiedPage.title)}
    subtitle={t(translations.emailNotifications.verifiedPage.subtitle)}
  />
);
