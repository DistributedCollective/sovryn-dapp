import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { BorrowPosition } from './BorrowPositionsList.types';
import { BorrowPositionAction } from './components/BorrowPositionAction/BorrowPositionAction';

const pageTranslations = translations.aavePage;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: (
      <span className="text-gray-30">{t(pageTranslations.common.asset)}</span>
    ),
    cellRenderer: (pool: BorrowPosition) => (
      <AssetRenderer
        dataAttribute="borrow-asset"
        showAssetLogo
        asset={pool.asset}
        className="lg:justify-start justify-end"
      />
    ),
    align: Align.center,
    sortable: true,
  },
  {
    id: 'balance',
    title: (
      <span className="flex items-center pl-5 gap-1 text-gray-30">
        {t(pageTranslations.common.balance)}{' '}
      </span>
    ),
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
  },
  {
    id: 'apr',
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(translations.aavePage.common.apr)}{' '}
        <HelperButton content={t(pageTranslations.common.aprInfo)} />
      </span>
    ),
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
  },
  {
    id: 'apyType',
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.common.apyType)}{' '}
        <HelperButton content={t(pageTranslations.common.apyTypeInfo)} />
      </span>
    ),
    sortable: true,
    align: Align.center,
    cellRenderer: (pos: BorrowPosition) => (
      <span>{t(pageTranslations.common[pos.apyType])}</span>
    ),
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    cellRenderer: (pool: BorrowPosition) => (
      <BorrowPositionAction pool={pool} />
    ),
  },
];
