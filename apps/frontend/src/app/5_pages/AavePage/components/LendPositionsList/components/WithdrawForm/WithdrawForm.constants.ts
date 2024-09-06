import { t } from 'i18next';

import { translations } from '../../../../../../../locales/i18n';

export const tabItems = [
  // For now just withdraw is supported
  {
    activeClassName: 'text-primary-20',
    dataAttribute: 'withdraw',
    label: t(translations.common.withdraw),
  },
];
