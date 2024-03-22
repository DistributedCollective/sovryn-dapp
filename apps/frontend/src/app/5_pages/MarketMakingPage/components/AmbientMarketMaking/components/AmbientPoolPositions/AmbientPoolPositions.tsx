import React, { FC } from 'react';

import { t } from 'i18next';

import {
  ButtonSize,
  Button,
  ButtonStyle,
  SimpleTableRow,
  Table,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { BITCOIN } from '../../../../../../../constants/currencies';
import { useIsMobile } from '../../../../../../../hooks/useIsMobile';
import { translations } from '../../../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { PoolsTableAction } from '../../../PoolsTable/components/PoolsTableAction/PoolsTableAction';
import { COLUMNS_CONFIG } from './AmbientPoolPositions.constants';
import styles from './AmbientPoolPositions.module.css';

type AmbientPoolPositionsProps = {
  pool: AmmLiquidityPool;
};

const positions = [
  {
    positionID: '0x1d865a7db2431e46d752443fb0c3b92d9ac33c34',
    minPrice: '53410',
    maxPrice: '53410',
    returns: '1.5',
    value: '4600',
    balanceUSD: '2000',
    balanceBTC: '0.04',
  },
];

export const AmbientPoolPositions: FC<AmbientPoolPositionsProps> = ({
  pool,
}) => {
  const { isMobile } = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 w-full p-1">
        {positions.map(position => (
          <div className="flex flex-col gap-2" key={position.positionID}>
            <SimpleTableRow
              label={t(
                translations.ambientMarketMaking.positionsTable.positionID,
              )}
              value={<TransactionIdRenderer hash={position.positionID} />}
            />
            <SimpleTableRow
              label={t(translations.ambientMarketMaking.positionsTable.balance)}
              value={
                <div className="flex flex-col gap-1">
                  <AmountRenderer value={position.balanceUSD} suffix="DLLR" />
                  <AmountRenderer
                    value={position.balanceBTC}
                    suffix={BITCOIN}
                  />
                </div>
              }
            />
            <SimpleTableRow
              label={t(translations.ambientMarketMaking.positionsTable.value)}
              value={<AmountRenderer value={position.value} prefix="$" />}
            />
            <SimpleTableRow
              label={
                <div className="flex flex-col">
                  <span>
                    {t(
                      translations.ambientMarketMaking.positionsTable.minPrice,
                    )}
                  </span>
                  <span>
                    {t(
                      translations.ambientMarketMaking.positionsTable.maxPrice,
                    )}
                  </span>
                </div>
              }
              value={
                <div className="flex flex-col">
                  <AmountRenderer value={position.minPrice} suffix="DLLR" />
                  <AmountRenderer value={position.maxPrice} suffix="DLLR" />
                </div>
              }
            />
            <SimpleTableRow
              label={t(translations.ambientMarketMaking.positionsTable.returns)}
              value={<AmountRenderer value={position.returns} suffix="%" />}
            />
            <Button
              className="w-full"
              style={ButtonStyle.secondary}
              size={ButtonSize.small}
              text={t(translations.common.withdraw)}
            />
          </div>
        ))}
        <PoolsTableAction pool={pool} />
      </div>
    );
  }
  return (
    <div className="w-full p-6">
      <Table
        columns={COLUMNS_CONFIG}
        rows={positions}
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        dataAttribute="ambient-pool-positions-table"
        preventExpandOnClickClass="prevent-row-click"
        className={styles.table}
      />
    </div>
  );
};
