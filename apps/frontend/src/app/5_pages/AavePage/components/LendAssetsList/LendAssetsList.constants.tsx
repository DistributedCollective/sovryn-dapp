import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton, Icon, IconNames } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendPoolDetails } from './LendAssetsList.types';
import { LendAssetAction } from './components/LendAssetAction/LendAssetAction';

const pageTranslations = translations.aavePage;

export const COLUMNS_CONFIG = (onLendClick: (asset: string) => unknown) => [
  {
    id: 'asset',
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    title: (
      <span className="text-gray-30">{t(pageTranslations.common.asset)}</span>
    ),
    cellRenderer: (pool: LendPoolDetails) => (
      <AssetRenderer
        dataAttribute="borrow-asset"
        chainId={BOB_CHAIN_ID}
        showAssetLogo
        asset={pool.asset}
        className="lg:justify-start justify-end"
        logoClassName="[&>svg]:h-8 [&>svg]:w-8 [&>svg]:mr-[10px]"
      />
    ),
  },
  {
    id: 'walletBalance',
    sortable: true,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    align: Align.center,
    title: (
      <span className="text-gray-30 text-center">
        {t(pageTranslations.lendAssetsList.walletBalance)}
      </span>
    ),
    cellRenderer: (pool: LendPoolDetails) => (
      <AmountRenderer value={pool.walletBalance} precision={2} />
    ),
  },
  {
    id: 'apy',
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.common.apy)}
        <HelperButton content={t(pageTranslations.common.apyInfo)} />
      </span>
    ),
    cellRenderer: (pool: LendPoolDetails) => (
      <AmountRenderer value={pool.apy} suffix={'%'} precision={2} />
    ),
  },
  {
    id: 'canBeCollateral',
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
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
    cellRenderer: (pool: LendPoolDetails) => (
      <LendAssetAction
        disabled={pool.walletBalance.eq(0)}
        onLendClick={() => onLendClick(pool.asset)}
      />
    ),
  },
];
