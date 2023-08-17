import { t } from 'i18next';

import { translations } from '../../../locales/i18n';

export const menuItemsMapping = [
  {
    text: t(translations.header.nav.borrow),
    url: '/',
  },
  {
    text: t(translations.header.nav.earn.title),
    url: '/earn',
    submenu: [
      {
        text: t(translations.header.nav.earn.subMenu.lend),
        label: t(translations.header.nav.earn.subMenu.lendDescription),
        url: '/earn/lend',
      },
      {
        text: t(translations.header.nav.earn.subMenu.stabilityPool),
        label: t(translations.header.nav.earn.subMenu.stabilityPoolDescription),
        url: '/earn/stability-pool',
      },
      {
        text: t(translations.header.nav.earn.subMenu.staking),
        label: t(translations.header.nav.earn.subMenu.stakingDescription),
        url: '/earn/staking',
      },
    ],
  },
  {
    text: t(translations.header.nav.convert),
    url: '/convert',
  },
];
