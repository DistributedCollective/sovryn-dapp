import React from 'react';

import { t } from 'i18next';

import { Align, HelperButton } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { BorrowPosition } from './BorrowPositionsList.types';
import { BorrowPositionAction } from './components/BorrowPositionAction/BorrowPositionAction';

const pageTranslations = translations.aavePage;

export const COLUMNS_CONFIG = [
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
      <span className="flex items-center pl-5 gap-1 text-gray-30">
        {t(pageTranslations.common.balance)}{' '}
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
        {t(translations.aavePage.common.apr)}{' '}
        <HelperButton content={t(pageTranslations.common.aprInfo)} />
      </span>
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
      <span>{t(pageTranslations.common[position.apyType])}</span>
    ),
  },
  {
    id: 'actions',
    align: Align.center,
    title: ' ',
    cellRenderer: (position: BorrowPosition) => (
      <BorrowPositionAction position={position} />
    ),
  },
];
