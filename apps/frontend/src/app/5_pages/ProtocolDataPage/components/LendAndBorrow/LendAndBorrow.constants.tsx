import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../../../../utils/LendingPool';
import { findAsset } from '../../../../../utils/asset';
import { normalizeToken } from '../../../BorrowPage/BorrowPage.utils';
import { AvailableSupply } from '../../../BorrowPage/components/BorrowAssetsTable/components/AvailableSupply/AvailableSupply';
import { NextBorrowInterestRate } from '../../../BorrowPage/components/BorrowAssetsTable/components/NextBorrowInterestRate/NextBorrowInterestRate';
import { NextSupplyInterestRate } from '../../../LendPage/components/NextSupplyInterestRate/NextSupplyInterestRate';
import styles from './LendAndBorrow.module.css';

const translation = translations.protocolDataPage.lendAndBorrow;

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: t(translation.asset),
    cellRenderer: (pool: LendingPool) => (
      <div className="flex items-center">
        <AssetRenderer
          showAssetLogo
          asset={pool.getAsset()}
          logoClassName={styles.assetLogo}
          className="lg:justify-start justify-end"
          assetClassName="text-xs font-medium"
        />
        <span className="text-gray-40 hidden lg:block">
          {findAsset(pool.getAsset(), RSK_CHAIN_ID)?.name}
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
