import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton, Toggle } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendPosition } from './LendPositionsList.types';
import { LendPositionAction } from './components/LendPositionAction/LendPositionAction';

const pageTranslations = translations.aavePage;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: (
      <span className="text-gray-30">{t(pageTranslations.common.asset)}</span>
    ),
    cellRenderer: (pool: LendPosition) => (
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
        {t(translations.aavePage.common.apy)}{' '}
        <HelperButton content={t(pageTranslations.common.apyInfo)} />
      </span>
    ),
    sortable: true,
    align: Align.center,
  },
  {
    id: 'collateral',
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.common.collateral)}{' '}
      </span>
    ),
    sortable: true,
    align: Align.center,
    cellRenderer: (pool: LendPosition) => (
      <div className="flex justify-center">
        {/* TODO: This should actually be a switch */}
        <Toggle checked={pool.collateral} onChange={() => 'TODO:'} />
      </div>
    ),
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    cellRenderer: (pool: LendPosition) => <LendPositionAction pool={pool} />,
  },
];
