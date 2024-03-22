import React from 'react';

import { t } from 'i18next';

import { ButtonSize, ButtonStyle, Button } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { BITCOIN } from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';

export const COLUMNS_CONFIG = [
  {
    id: 'positionID',
    title: t(translations.ambientMarketMaking.positionsTable.positionID),
    cellRenderer: (position: any) => (
      <TransactionIdRenderer hash={position.positionID} />
    ),
  },
  {
    id: 'liquidity',
    title: (
      <div className="flex flex-col">
        <span>
          {t(translations.ambientMarketMaking.positionsTable.minPrice)}
        </span>
        <span>
          {t(translations.ambientMarketMaking.positionsTable.maxPrice)}
        </span>
      </div>
    ),
    cellRenderer: (position: any) => (
      <div className="flex flex-col">
        <AmountRenderer value={position.minPrice} suffix="DLLR" />
        <AmountRenderer value={position.maxPrice} suffix="DLLR" />
      </div>
    ),
  },
  {
    id: 'returns',
    title: t(translations.ambientMarketMaking.positionsTable.returns),
    cellRenderer: (position: any) => (
      <AmountRenderer value={position.returns} suffix="%" />
    ),
  },
  {
    id: 'value',
    title: t(translations.ambientMarketMaking.positionsTable.value),
    cellRenderer: (position: any) => (
      <AmountRenderer value={position.value} prefix="$" />
    ),
  },
  {
    id: 'balance',
    title: t(translations.ambientMarketMaking.positionsTable.balance),
    cellRenderer: (position: any) => (
      <div className="flex flex-col gap-1">
        <AmountRenderer value={position.balanceUSD} suffix="DLLR" />
        <AmountRenderer value={position.balanceBTC} suffix={BITCOIN} />
      </div>
    ),
  },
  {
    id: '',
    title: '',
    cellRenderer: (position: any) => (
      <div className="flex justify-end items-center">
        <Button
          style={ButtonStyle.secondary}
          size={ButtonSize.small}
          text={t(translations.common.withdraw)}
        />
      </div>
    ),
    className: 'table-cell',
  },
];
