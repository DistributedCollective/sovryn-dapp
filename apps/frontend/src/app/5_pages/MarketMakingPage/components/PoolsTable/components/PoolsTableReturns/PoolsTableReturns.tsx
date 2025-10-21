import React, { FC, useMemo } from 'react';

import classNames from 'classnames';

import { useGetReturnRate } from '../../../../hooks/useGetReturnRate';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import styles from './PoolsTableReturns.module.css';

type PoolsTableReturnsProps = {
  pool: AmmLiquidityPool;
  className?: string;
};

export const PoolsTableReturns: FC<PoolsTableReturnsProps> = ({
  pool,
  className,
}) => {
  const { returnRates } = useGetReturnRate(pool);

  const returnRate = useMemo(
    () =>
      returnRates.beforeRewards === '0.00' ? '0' : returnRates.beforeRewards,
    [returnRates],
  );

  return (
    <div className={classNames(styles.rewards, className)}>{returnRate}%</div>
  );
};
