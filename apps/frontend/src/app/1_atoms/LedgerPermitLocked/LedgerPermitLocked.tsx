import React from 'react';

import { t } from 'i18next';

import { ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';

export const LedgerPermitLocked = () => (
  <ErrorBadge
    level={ErrorLevel.Critical}
    message={t(translations.errors.ledgerPermitLocked)}
  />
);
