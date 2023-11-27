import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { ContextLink } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { useGetReturnRate } from '../../../../hooks/useGetReturnRate';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

type PoolsTableReturnsProps = {
  pool: AmmLiquidityPool;
  className?: string;
};
export const PoolsTableReturns: FC<PoolsTableReturnsProps> = ({
  pool,
  className,
}) => {
  const { returnRates } = useGetReturnRate(pool.converter);

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
    () => (
      <div>
        {t(translations.marketMakingPage.poolsTableReturns.title, {
          percent: returnRates.afterRewards,
        })}
      </div>
    ),
    [returnRates],
  );

  return (
    <ContextLink
      className={className}
      children={renderChildren}
      tooltipContent={renderTooltipChildren}
    />
  );
};
