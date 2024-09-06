import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { BorrowPosition } from './BorrowPositionsList.types';
import { BorrowPositionAction } from './components/BorrowPositionAction/BorrowPositionAction';
import { BorrowRateModeSelect } from './components/BorrowRateModeSelect/BorrowRateModeSelect';

const pageTranslations = translations.aavePage;

export const COLUMNS_CONFIG = (onRepayClick: (asset: string) => void) => [
  {
    id: 'asset',
    sortable: true,
    align: Align.center,
    title: (
      <span className="text-gray-30">{t(pageTranslations.common.asset)}</span>
    ),
    cellRenderer: (position: BorrowPosition) => (
      <AssetRenderer
        dataAttribute="borrow-asset"
        showAssetLogo
        asset={position.asset}
        chainId={BOB_CHAIN_ID}
        className="lg:justify-start justify-end"
        logoClassName="[&>svg]:h-8 [&>svg]:w-8 [&>svg]:mr-[10px]"
      />
    ),
  },
  {
    id: 'balance',
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    title: (
      <span className="flex items-center pl-5 text-gray-30">
        {t(pageTranslations.common.balance)}
      </span>
    ),
    cellRenderer: (pool: BorrowPosition) => (
      <AmountRenderer value={pool.borrowed} suffix={pool.asset} />
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
    cellRenderer: (position: BorrowPosition) => (
      <AmountRenderer value={position.apy} suffix="%" precision={2} />
    ),
  },
  {
    id: 'apyType',
    sortable: true,
    align: Align.center,
    className: '[&_*]:mx-auto [&_*]:space-x-2', // center head
    title: (
      <span className="flex items-center gap-1 text-gray-30">
        {t(pageTranslations.common.apyType)}{' '}
        <HelperButton content={t(pageTranslations.common.apyTypeInfo)} />
      </span>
    ),
    cellRenderer: (position: BorrowPosition) => (
      <div className="flex items-center justify-center">
        <BorrowRateModeSelect position={position} />
      </div>
    ),
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    cellRenderer: (position: BorrowPosition) => (
      <BorrowPositionAction onRepayClick={() => onRepayClick(position.asset)} />
    ),
  },
];
