import { t } from 'i18next';

import { translations } from '../../../locales/i18n';

export type MenuItem = {
  text: string;
  url: string;
  submenu?: SubMenuItem[];
};

export type SubMenuItem = {
  text: string;
  label: string;
  url: string;
};

export const menuItemsMapping: MenuItem[] = [
  {
    text: t(translations.header.nav.borrow.title),
    url: '/borrow',
    submenu: [
      {
        text: t(translations.header.nav.borrow.subMenu.fixedInterest),
        label: t(
          translations.header.nav.borrow.subMenu.fixedInterestDescription,
        ),
        url: '/borrow/fixed-interest',
      },
      {
        text: t(translations.header.nav.borrow.subMenu.lineOfCredit),
        label: t(
          translations.header.nav.borrow.subMenu.lineOfCreditDescription,
        ),
        url: '/borrow/line-of-credit',
      },
    ],
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
        text: t(translations.header.nav.earn.subMenu.marketMaking),
        label: t(translations.header.nav.earn.subMenu.marketMakingDescription),
        url: '/earn/market-making',
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
  {
    text: t(translations.header.nav.bitocracy),
    url: '/bitocracy',
  },
  {
    text: t(translations.header.nav.runes),
    url: '/runes',
  },
];
