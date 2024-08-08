import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { BorrowPoolAssetDetails } from './BorrowAssetsList.types';
import { BorrowAssetAction } from './components/BorrowAssetAction/BorrowAssetAction';

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: (
      <span className="text-gray-30">
        {t(translations.aavePage.common.asset)}
      </span>
    ),
    cellRenderer: (pool: BorrowPoolAssetDetails) => (
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
    id: 'available',
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(translations.aavePage.borrowAssetsList.available)}{' '}
        <HelperButton
          content={t(translations.aavePage.borrowAssetsList.availableInfo)}
        />
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
        <HelperButton content={t(translations.aavePage.common.aprInfo)} />
      </span>
    ),
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    cellRenderer: (pool: BorrowPoolAssetDetails) => (
      <BorrowAssetAction pool={pool} />
    ),
  },
];
