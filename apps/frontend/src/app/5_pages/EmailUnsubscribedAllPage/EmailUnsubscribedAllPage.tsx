import React from 'react';

import { t } from 'i18next';

import { EmailVerificationState } from '../../2_molecules/EmailVerificationState/EmailVerificationState';
import { translations } from '../../../locales/i18n';

export const EmailUnsubscribedAllPage = () => (
  <EmailVerificationState
    metaTitle={t(
      translations.emailNotifications.unsubscribedAllPage.meta.title,
    )}
    title={t(translations.emailNotifications.unsubscribedAllPage.title)}
    subtitle={t(translations.emailNotifications.unsubscribedAllPage.subtitle)}
  />
);
