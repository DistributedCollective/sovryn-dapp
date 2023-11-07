import React from 'react';

import { t } from 'i18next';

import { HelperButton } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';

export const COLUMNS_CONFIG = [
  {
    id: 'pair',
    title: t(translations.marketMakingPage.table.pair),
    cellRenderer: (pool: AmmLiquidityPool) => 'pair',
  },
  {
    id: 'liquidity',
    title: t(translations.marketMakingPage.table.liquidity),
    cellRenderer: (pool: AmmLiquidityPool) => 'liquidity',
  },
  {
    id: 'returns',
    title: (
      <span className="flex items-center gap-1">
        {t(translations.marketMakingPage.table.returns)}{' '}
        <HelperButton
          content={t(translations.marketMakingPage.table.returnsInfo)}
        />
      </span>
    ),
    cellRenderer: (pool: AmmLiquidityPool) => 'returns',
  },
  {
    id: 'volume',
    title: t(translations.marketMakingPage.table.volume),
    cellRenderer: (pool: AmmLiquidityPool) => 'volume',
  },
  {
    id: 'balance',
    title: t(translations.marketMakingPage.table.balance),
    cellRenderer: (pool: AmmLiquidityPool) => 'balance',
  },
  {
    id: '',
    title: '',
    cellRenderer: (pool: AmmLiquidityPool) => 'action',
    className: 'hidden lg:table-cell',
  },
];
