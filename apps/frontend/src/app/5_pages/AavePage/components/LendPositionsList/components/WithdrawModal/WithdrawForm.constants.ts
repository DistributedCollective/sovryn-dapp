import { t } from 'i18next';

import { translations } from '../../../../../../../locales/i18n';

// For now just withdraw is supported
export const TAB_ITEMS = [
  {
    activeClassName: 'text-primary-20',
    dataAttribute: 'withdraw',
    label: t(translations.common.withdraw),
  },
];
