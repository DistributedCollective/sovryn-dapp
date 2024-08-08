import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton, Icon, IconNames } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendPoolDetails } from './LendAssetsList.types';
import { LendAssetAction } from './components/LendAssetAction/LendAssetAction';

const pageTranslations = translations.aavePage;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    sortable: true,
    align: Align.center,
    title: (
      <span className="text-gray-30">{t(pageTranslations.common.asset)}</span>
    ),
    cellRenderer: (pool: LendPoolDetails) => (
      <AssetRenderer
        dataAttribute="borrow-asset"
        showAssetLogo
        asset={pool.asset}
        className="lg:justify-start justify-end"
      />
    ),
  },
  {
    id: 'walletBalance',
    sortable: true,
    align: Align.center,
    title: (
      <span className="text-gray-30">
        {t(pageTranslations.lendAssetsList.walletBalance)}{' '}
      </span>
    ),
  },
  {
    id: 'apy',
    sortable: true,
    align: Align.center,
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.common.apy)}{' '}
        <HelperButton content={t(pageTranslations.common.apyInfo)} />
      </span>
    ),
  },
  {
    id: 'canBeCollateral',
    sortable: true,
    align: Align.center,
    title: (
      <span className="text-gray-30">
        {t(pageTranslations.lendAssetsList.canBeCollateral)}
      </span>
    ),
    cellRenderer: (pool: LendPoolDetails) => (
      <div className="flex justify-center">
        {pool.canBeCollateral ? (
          <Icon icon={IconNames.CHECK} className="w-[10px] text-positive" />
        ) : (
          <Icon icon={IconNames.X_MARK} className="w-[10px] text-negative" />
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    cellRenderer: (pool: LendPoolDetails) => <LendAssetAction pool={pool} />,
  },
];
