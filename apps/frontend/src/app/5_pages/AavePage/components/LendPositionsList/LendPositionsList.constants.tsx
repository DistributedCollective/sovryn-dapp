import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendPosition } from './LendPositionsList.types';
import { LendPositionAction } from './components/LendPositionAction/LendPositionAction';
import { ToggleCollateralAction } from './components/ToggleCollateralAction/ToggleCollateralAction';

const pageTranslations = translations.aavePage;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    sortable: true,
    align: Align.center,
    title: (
      <span className="text-gray-30">{t(pageTranslations.common.asset)}</span>
    ),
    cellRenderer: (position: LendPosition) => (
      <AssetRenderer
        dataAttribute="borrow-asset"
        showAssetLogo
        asset={position.asset}
        className="lg:justify-start justify-end"
      />
    ),
  },
  {
    id: 'balance',
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    title: (
      <span className="text-gray-30">{t(pageTranslations.common.balance)}</span>
    ),
  },
  {
    id: 'apy',
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(translations.aavePage.common.apy)}{' '}
        <HelperButton content={t(pageTranslations.common.apyInfo)} />
      </span>
    ),
  },
  {
    id: 'collateral',
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.common.collateral)}{' '}
      </span>
    ),
    cellRenderer: (position: LendPosition) => (
      <ToggleCollateralAction position={position} />
    ),
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    cellRenderer: (position: LendPosition) => (
      <LendPositionAction position={position} />
    ),
  },
];
