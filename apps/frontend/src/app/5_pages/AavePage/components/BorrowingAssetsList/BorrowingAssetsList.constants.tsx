import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { BorrowPoolAssetDetails } from './BorrowingAssetsList.types';
import { BorrowAssetAction } from './components/BorrowAssetAction/BorrowAssetAction';

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: t(translations.aavePage.borrowingAssetsList.asset),
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
      <span className="flex items-center gap-1">
        {t(translations.aavePage.borrowingAssetsList.available)}{' '}
        <HelperButton
          content={t(translations.aavePage.borrowingAssetsList.availableInfo)}
        />
      </span>
    ),
    sortable: true,
    align: Align.center,
  },
  {
    id: 'apr',
    title: (
      <span className="flex items-center gap-1">
        {t(translations.aavePage.borrowingAssetsList.apr)}{' '}
        <HelperButton
          content={t(translations.aavePage.borrowingAssetsList.aprInfo)}
        />
      </span>
    ),
    sortable: true,
    align: Align.center,
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
