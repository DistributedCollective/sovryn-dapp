import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetAmountPriceRenderer } from '../../../../2_molecules/AssetAmountPriceRenderer/AssetAmountPriceRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { BorrowPoolDetails } from './BorrowAssetsList.types';
import { BorrowAssetAction } from './components/BorrowAssetAction/BorrowAssetAction';

const pageTranslations = translations.aavePage;

export const COLUMNS_CONFIG = (onBorrowClick: (asset: string) => void) => [
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
        chainId={BOB_CHAIN_ID}
        className="lg:justify-start justify-end"
        logoClassName="[&>svg]:h-8 [&>svg]:w-8 [&>svg]:mr-[10px]"
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
    cellRenderer: (position: BorrowPoolDetails) =>
      position.available !== undefined &&
      position.availableUSD !== undefined ? (
        <AssetAmountPriceRenderer
          value={position.available}
          valueUSD={position.availableUSD}
          asset={position.asset}
        />
      ) : (
        <span>-</span>
      ),
  },
  {
    id: 'apy',
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.common.apr)}{' '}
        <HelperButton content={t(pageTranslations.common.aprInfo)} />
      </span>
    ),
    cellRenderer: (pool: BorrowPoolDetails) => (
      <AmountRenderer value={pool.apy} suffix="%" precision={2} />
    ),
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    cellRenderer: (pool: BorrowPoolDetails) => (
      <BorrowAssetAction
        disabled={!pool.available || pool.available.eq(0)}
        onBorrowClick={() => onBorrowClick(pool.asset)}
        asset={pool.asset}
      />
    ),
  },
];
