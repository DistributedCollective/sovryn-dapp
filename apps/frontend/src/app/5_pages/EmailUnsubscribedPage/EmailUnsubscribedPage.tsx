import React from 'react';

import { t } from 'i18next';

import { EmailVerificationState } from '../../2_molecules/EmailVerificationState/EmailVerificationState';
import { translations } from '../../../locales/i18n';

export const EmailUnsubscribedPage = () => (
  <EmailVerificationState
    metaTitle={t(translations.emailNotifications.unsubscribedPage.meta.title)}
    title={t(translations.emailNotifications.unsubscribedPage.title)}
    subtitle={t(translations.emailNotifications.unsubscribedPage.subtitle)}
  />
);
