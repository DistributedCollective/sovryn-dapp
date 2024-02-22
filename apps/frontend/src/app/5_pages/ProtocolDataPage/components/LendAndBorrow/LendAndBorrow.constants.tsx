import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { getTokenLongName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../../../../utils/LendingPool';
import { normalizeToken } from '../../../BorrowPage/BorrowPage.utils';
import { AvailableSupply } from '../../../BorrowPage/components/BorrowAssetsTable/components/AvailableSupply/AvailableSupply';
import { NextBorrowInterestRate } from '../../../BorrowPage/components/BorrowAssetsTable/components/NextBorrowInterestRate/NextBorrowInterestRate';
import { NextSupplyInterestRate } from '../../../LendPage/components/NextSupplyInterestRate/NextSupplyInterestRate';

const translation = translations.protocolDataPage.lendAndBorrow;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: t(translation.asset),
    cellRenderer: (pool: LendingPool) => (
      <div className="flex items-center font-medium text-base sm:text-xs">
        <AssetRenderer
          showAssetLogo
          asset={pool.getAsset()}
          className="lg:justify-start justify-end"
        />
        <span className="text-gray-40 hidden lg:block">
          {getTokenLongName(pool.getAsset())}
        </span>
      </div>
    ),
  },
  {
    id: 'borrowApr',
    title: t(translation.borrowApr),
    cellRenderer: (pool: LendingPool) => (
      <NextBorrowInterestRate asset={normalizeToken(pool.getAsset())} />
    ),
  },
  {
    id: 'lendApr',
    title: (
      <span className="flex items-center gap-1">
        {t(translation.lendApr)}{' '}
        <HelperButton content={t(translations.lendPage.table.lendAprInfo)} />
      </span>
    ),
    cellRenderer: (pool: LendingPool) => (
      <NextSupplyInterestRate asset={pool.getAsset()} />
    ),
  },
  {
    id: 'availableSupply',
    title: t(translation.availableSupply),
    cellRenderer: (pool: LendingPool) => <AvailableSupply pool={pool} />,
  },
];
