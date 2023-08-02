import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../utils/LendingPool';
import { AcceptedCollateral } from '../AcceptedCollateral/AcceptedCollateral';
import { NextSupplyInterestRate } from '../NextSupplyInterestRate/NextSupplyInterestRate';
import { LendFrameAction } from './components/LendFrameAction/LendFrameAction';
import { LendFrameBalance } from './components/LendFrameBalance/LendFrameBalance';
import { LendFrameInterestEarned } from './components/LendFrameInterestEarned/LendFrameInterestEarned';

export const COLUMNS_CONFIG = [
  {
    id: 'asset',
    title: t(translations.lendPage.table.asset),
    cellRenderer: (pool: LendingPool) => (
      <AssetRenderer
        dataAttribute="lend-frame-asset"
        showAssetLogo
        asset={pool.getAsset()}
        className="lg:justify-start justify-end"
      />
    ),
  },
  {
    id: 'lendApy',
    title: (
      <span className="flex items-center gap-1">
        {t(translations.lendPage.table.lendApy)}{' '}
        <HelperButton content={t(translations.lendPage.table.lendApyInfo)} />
      </span>
    ),
    cellRenderer: (pool: LendingPool) => (
      <NextSupplyInterestRate asset={pool.getAsset()} />
    ),
  },
  {
    id: 'acceptedCollateral',
    title: t(translations.lendPage.table.acceptedCollateral),
    cellRenderer: (pool: LendingPool) => <AcceptedCollateral pool={pool} />,
  },
  {
    id: 'balance',
    title: t(translations.lendPage.table.balance),
    cellRenderer: (pool: LendingPool) => <LendFrameBalance pool={pool} />,
  },
  {
    id: 'interestEarned',
    title: (
      <span className="flex items-center gap-1">
        {t(translations.lendPage.table.interestEarned)}{' '}
        <HelperButton
          content={t(translations.lendPage.table.interestEarnedInfo)}
        />
      </span>
    ),
    cellRenderer: (pool: LendingPool) => (
      <LendFrameInterestEarned pool={pool} />
    ),
  },
  {
    id: '',
    title: '',
    cellRenderer: (pool: LendingPool) => <LendFrameAction pool={pool} />,
    className: 'hidden lg:table-cell',
  },
];
