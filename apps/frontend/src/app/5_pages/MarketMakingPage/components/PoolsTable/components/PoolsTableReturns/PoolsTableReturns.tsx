import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { ContextLink } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
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

  const hasRewards = useMemo(
    () => Number(returnRates.afterRewards) > 0,
    [returnRates],
  );

  const renderTooltipChildren = useMemo(
    () => (
      <div className="flex flex-col">
        <div>
          {t(translations.marketMakingPage.poolsTableReturns.before, {
            percent: returnRates.beforeRewards,
          })}
        </div>
        <div>
          {t(translations.marketMakingPage.poolsTableReturns.after, {
            percent: returnRates.afterRewards,
          })}
        </div>
      </div>
    ),
    [returnRates],
  );

  const renderChildren = useMemo(
    () =>
      hasRewards
        ? t(translations.marketMakingPage.poolsTableReturns.title, {
            percent: returnRates.afterRewards,
          })
        : '0%',
    [returnRates, hasRewards],
  );

  const renderComponent = useMemo(
    () =>
      hasRewards ? (
        <ContextLink
          className={className}
          children={renderChildren}
          tooltipContent={renderTooltipChildren}
        />
      ) : (
        <div className={styles.rewards}>{renderChildren}</div>
      ),
    [className, hasRewards, renderChildren, renderTooltipChildren],
  );

  return renderComponent;
};
