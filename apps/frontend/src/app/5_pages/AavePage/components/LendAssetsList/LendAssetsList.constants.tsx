import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton, Icon } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendPoolAssetDetails } from './LendAssetsList.types';
import { LendAssetAction } from './components/LendAssetAction/LendAssetAction';

const pageTranslations = translations.aavePage;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: (
      <span className="text-gray-30">
        {t(pageTranslations.lendAssetsList.asset)}
      </span>
    ),
    cellRenderer: (pool: LendPoolAssetDetails) => (
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
    id: 'walletBalance',
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.lendAssetsList.walletBalance)}{' '}
      </span>
    ),
    sortable: true,
    align: Align.center,
  },
  {
    id: 'apy',
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.lendAssetsList.apy)}{' '}
        <HelperButton content={t(pageTranslations.common.apyInfo)} />
      </span>
    ),
    sortable: true,
    align: Align.center,
  },
  {
    id: 'canBeCollateral',
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.lendAssetsList.canBeCollateral)}{' '}
      </span>
    ),
    sortable: true,
    align: Align.center,
    cellRenderer: (pool: LendPoolAssetDetails) => (
      <div className="flex justify-center">
        {pool.canBeCollateral && (
          <Icon icon="check" className="w-[10px] text-positive" />
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    cellRenderer: (pool: LendPoolAssetDetails) => (
      <LendAssetAction pool={pool} />
    ),
  },
];
