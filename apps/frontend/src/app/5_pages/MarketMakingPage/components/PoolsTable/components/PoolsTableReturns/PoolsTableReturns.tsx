import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { ContextLink } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

type PoolsTableReturnsProps = {
  pool: AmmLiquidityPool;
  className?: string;
};
export const PoolsTableReturns: FC<PoolsTableReturnsProps> = ({
  pool,
  className,
}) => {
  const renderTooltipChildren = useMemo(
    () => (
      <div className="flex flex-col">
        <div>
          {t(translations.marketMakingPage.poolsTableReturns.before, {
            percent: '0.5',
          })}
        </div>
        <div>
          {t(translations.marketMakingPage.poolsTableReturns.after, {
            percent: '8.5',
          })}
        </div>
      </div>
    ),
    [],
  );

  const renderChildren = useMemo(
    () => (
      <div>
        {t(translations.marketMakingPage.poolsTableReturns.title, {
          percent: '8.5',
        })}
      </div>
    ),
    [],
  );

  return (
    <ContextLink
      className={className}
      children={renderChildren}
      tooltipContent={renderTooltipChildren}
    />
  );
};
