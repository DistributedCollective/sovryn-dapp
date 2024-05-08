import React, { FC } from 'react';

import { t } from 'i18next';

import { HelperButton, SimpleTableRow, Table } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TransactionIdRenderer } from '../../../../../../2_molecules/TransactionIdRenderer/TransactionIdRenderer';
import { useIsMobile } from '../../../../../../../hooks/useIsMobile';
import { translations } from '../../../../../../../locales/i18n';
import { useGetAmbientPositions } from '../../hooks/useGetAmbientPositions';
import { AmbientLiquidityPool } from '../../utils/AmbientLiquidityPool';
import { COLUMNS_CONFIG } from './AmbientPoolPositions.constants';
import styles from './AmbientPoolPositions.module.css';
import { AmbientPoolPositionClaimFees } from './components/AmbientPoolPositionClaimFees/AmbientPoolPositionClaimFees';
import { AmbientPoolPositionWithdraw } from './components/AmbientPoolPositionWithdraw/AmbientPoolPositionWithdraw';
import { AmbientPositionBalance } from './components/AmbientPositionBalance/AmbientPositionBalance';
import { AmbientPositionPrices } from './components/AmbientPositionPrices/AmbientPositionPrices';
import { AmbientPositionValue } from './components/AmbientPositionValue/AmbientPositionValue';

type AmbientPoolPositionsProps = {
  pool: AmbientLiquidityPool;
};

export const AmbientPoolPositions: FC<AmbientPoolPositionsProps> = ({
  pool,
}) => {
  const { positions, isLoading } = useGetAmbientPositions(pool);

  const { isMobile } = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 w-full p-1">
        {positions.map(position => (
          <div className="flex flex-col gap-2" key={position.positionId}>
            <SimpleTableRow
              label={t(
                translations.ambientMarketMaking.positionsTable.positionID,
              )}
              value={
                <TransactionIdRenderer
                  hash={position.firstMintTx}
                  chainId={pool.chainId}
                />
              }
            />
            <SimpleTableRow
              label={t(translations.ambientMarketMaking.positionsTable.balance)}
              value={<AmbientPositionBalance pool={pool} position={position} />}
            />
            <SimpleTableRow
              label={t(translations.ambientMarketMaking.positionsTable.value)}
              value={<AmbientPositionValue pool={pool} position={position} />}
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
              value={<AmbientPositionPrices pool={pool} position={position} />}
            />
            <SimpleTableRow
              label={
                <span className="flex items-center gap-1">
                  {t(translations.ambientMarketMaking.positionsTable.apr)}{' '}
                  <HelperButton
                    content={t(
                      translations.ambientMarketMaking.positionsTable.aprInfo,
                    )}
                  />
                </span>
              }
              value={
                <AmountRenderer value={position.aprEst * 100} suffix="%" />
              }
            />
            {position.rewardLiq > 0 && (
              <AmbientPoolPositionClaimFees
                pool={pool}
                position={position}
                className="mb-2"
              />
            )}
            <AmbientPoolPositionWithdraw pool={pool} position={position} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <Table
        columns={COLUMNS_CONFIG(pool)}
        rows={positions}
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        dataAttribute="ambient-pool-positions-table"
        preventExpandOnClickClass="prevent-row-click"
        className={styles.table}
        isLoading={!positions.length ? isLoading : false}
        rowKey={row => row.positionId}
      />
    </div>
  );
};
