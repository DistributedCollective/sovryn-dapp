import React, { FC, useMemo } from 'react';

import classNames from 'classnames';

import { USDT0_BTC_AMM_POOL_TOKEN } from '../../../../MarketMakingPage.constants';
import { useGetReturnRate } from '../../../../hooks/useGetReturnRate';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import styles from './PoolsTableReturns.module.css';
import { MerklIncentiveBadge } from './components/MerklIncentiveBadge/MerklIncentiveBadge';
import { MERKL_USDT0_CAMPAIGN_APR_BOOST } from './components/MerklIncentiveBadge/MerklIncentiveBadge.constants';

type PoolsTableReturnsProps = {
  pool: AmmLiquidityPool;
  className?: string;
};

export const PoolsTableReturns: FC<PoolsTableReturnsProps> = ({
  pool,
  className,
}) => {
  const returnRates = useGetReturnRate(pool);

  const returnRate = useMemo(
    () =>
      returnRates.beforeRewards === '0.00' ? '0' : returnRates.beforeRewards,
    [returnRates],
  );

  // USDT0 migration campaign (Merkl, ~10% APR) — remove once the campaign ends
  const hasMerklIncentive = useMemo(
    () => pool.poolTokenA === USDT0_BTC_AMM_POOL_TOKEN.toLowerCase(),
    [pool.poolTokenA],
  );

  const boostedReturnRate = useMemo(
    () => (MERKL_USDT0_CAMPAIGN_APR_BOOST + Number(returnRate)).toFixed(2),
    [returnRate],
  );

  return (
    <div className={classNames(styles.rewards, className)}>
      {hasMerklIncentive ? (
        <span className="inline-flex items-center gap-1">
          <span>~{boostedReturnRate}%</span>
          <MerklIncentiveBadge />
        </span>
      ) : (
        <>{returnRate}%</>
      )}
    </div>
  );
};
