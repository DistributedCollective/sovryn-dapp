import { t } from 'i18next';

import { translations } from '../../../locales/i18n';

export const TAB_ITEMS = [
  {
    activeClassName: 'text-primary-20',
    dataAttribute: 'reserve-status',
    label: t(translations.aaveReserveOverviewPage.reserveStatusTab.title),
  },
  {
    activeClassName: 'text-primary-20',
    dataAttribute: 'your-wallet',
    label: t(translations.aaveReserveOverviewPage.yourWalletTab.title),
  },
];
