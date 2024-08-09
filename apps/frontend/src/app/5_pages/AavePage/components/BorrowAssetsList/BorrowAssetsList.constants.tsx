import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { BorrowPoolDetails } from './BorrowAssetsList.types';
import { BorrowAssetAction } from './components/BorrowAssetAction/BorrowAssetAction';

const pageTranslations = translations.aavePage;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    sortable: true,
    align: Align.center,
    title: (
      <span className="text-gray-30">{t(pageTranslations.common.asset)}</span>
    ),
    cellRenderer: (pool: BorrowPoolDetails) => (
      <AssetRenderer
        dataAttribute="borrow-asset"
        showAssetLogo
        asset={pool.asset}
        className="lg:justify-start justify-end"
      />
    ),
  },
  {
    id: 'available',
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.borrowAssetsList.available)}{' '}
        <HelperButton
          content={t(pageTranslations.borrowAssetsList.availableInfo)}
        />
      </span>
    ),
  },
  {
    id: 'apr',
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.common.apr)}{' '}
        <HelperButton content={t(pageTranslations.common.aprInfo)} />
      </span>
    ),
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    cellRenderer: (pool: BorrowPoolDetails) => (
      <BorrowAssetAction pool={pool} />
    ),
  },
];
