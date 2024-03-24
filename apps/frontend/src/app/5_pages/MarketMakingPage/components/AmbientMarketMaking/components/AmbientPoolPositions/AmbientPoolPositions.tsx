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
import { useGetAmbientPositions } from '../../hooks/useGetAmbientPositions';
import { COLUMNS_CONFIG } from './AmbientPoolPositions.constants';
import styles from './AmbientPoolPositions.module.css';

type AmbientPoolPositionsProps = {
  pool: AmmLiquidityPool;
};

export const AmbientPoolPositions: FC<AmbientPoolPositionsProps> = ({
  pool,
}) => {
  const { positions, isLoading } = useGetAmbientPositions();

  const { isMobile } = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 w-full p-1">
        {positions.map(position => (
          <div className="flex flex-col gap-2" key={position.positionId}>
            <SimpleTableRow
              label={t(
                translations.ambientMarketMaking.positionsTable.positionID,
              )}
              value={<TransactionIdRenderer hash={position.positionId} />}
            />
            <SimpleTableRow
              label={t(translations.ambientMarketMaking.positionsTable.balance)}
              value={
                <div className="flex flex-col gap-1">
                  <AmountRenderer value={'1000'} suffix="DLLR" />
                  <AmountRenderer value={'1000'} suffix={BITCOIN} />
                </div>
              }
            />
            <SimpleTableRow
              label={t(translations.ambientMarketMaking.positionsTable.value)}
              value={<AmountRenderer value={'1000'} prefix="$" />}
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
                  <AmountRenderer value={position.bidTick} suffix="DLLR" />
                  <AmountRenderer value={position.askTick} suffix="DLLR" />
                </div>
              }
            />
            <SimpleTableRow
              label={t(translations.ambientMarketMaking.positionsTable.returns)}
              value={<AmountRenderer value={'10'} suffix="%" />}
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
        isLoading={isLoading}
      />
    </div>
  );
};
