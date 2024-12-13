import { t } from 'i18next';

import { translations } from '../../../../../../../locales/i18n';

export const TAB_ITEMS = [
  {
    activeClassName: 'text-primary-20',
    dataAttribute: 'wallet-balance',
    label: t(translations.aavePage.repayModal.walletBalance),
  },
  {
    activeClassName: 'text-primary-20',
    dataAttribute: 'collateral',
    label: t(translations.aavePage.common.collateral),
    disabled: true,
  },
];
