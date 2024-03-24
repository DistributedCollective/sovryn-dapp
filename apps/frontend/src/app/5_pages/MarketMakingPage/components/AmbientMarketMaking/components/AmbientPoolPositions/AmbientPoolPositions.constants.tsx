import React from 'react';

import { t } from 'i18next';

import { ButtonSize, ButtonStyle, Button } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { BITCOIN } from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientPosition } from '../../AmbientMarketMaking.types';

export const COLUMNS_CONFIG = [
  {
    id: 'positionID',
    title: t(translations.ambientMarketMaking.positionsTable.positionID),
    cellRenderer: (position: AmbientPosition) => (
      <TransactionIdRenderer hash={position.positionId} />
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
    cellRenderer: (position: AmbientPosition) => (
      <div className="flex flex-col">
        <AmountRenderer value={position.bidTick} suffix="DLLR" />
        <AmountRenderer value={position.askTick} suffix="DLLR" />
      </div>
    ),
  },
  {
    id: 'returns',
    title: t(translations.ambientMarketMaking.positionsTable.returns),
    cellRenderer: (position: AmbientPosition) => (
      <AmountRenderer value={'10'} suffix="%" />
    ),
  },
  {
    id: 'value',
    title: t(translations.ambientMarketMaking.positionsTable.value),
    cellRenderer: (position: AmbientPosition) => (
      <AmountRenderer value={'1000'} prefix="$" />
    ),
  },
  {
    id: 'balance',
    title: t(translations.ambientMarketMaking.positionsTable.balance),
    cellRenderer: (position: AmbientPosition) => (
      <div className="flex flex-col gap-1">
        <AmountRenderer value={'1000'} suffix="DLLR" />
        <AmountRenderer value={'1000'} suffix={BITCOIN} />
      </div>
    ),
  },
  {
    id: '',
    title: '',
    cellRenderer: (position: AmbientPosition) => (
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
