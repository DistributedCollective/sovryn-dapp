import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Tooltip, TooltipTrigger } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../utils/LendingPool';
import { AssetTooltipContent } from './components/AssetTooltipContent';

const COLLATERAL_ITEMS_TO_SHOW = 3;

type AcceptedCollateralProps = {
  pool: LendingPool;
};

export const AcceptedCollateral: FC<AcceptedCollateralProps> = ({ pool }) => {
  const availableAssets = useMemo(() => pool.getBorrowCollateral(), [pool]);

  const renderPools = useMemo(() => {
    if (!availableAssets.length) {
      return t(translations.common.na);
    }

    if (availableAssets.length <= COLLATERAL_ITEMS_TO_SHOW) {
      return availableAssets.map((item, index) => (
        <Tooltip
          key={index}
          tooltipClassName="min-w-44 min-h-10"
          className="font-medium inline-flex whitespace-pre items-center cursor-pointer text-primary-20 underline text-xs w-auto prevent-row-click"
          content={<AssetTooltipContent asset={item} />}
          dataAttribute="lend-accepted-collateral-tooltip-asset"
          trigger={TooltipTrigger.click}
        >
          <div>
            <span>{item.toUpperCase()}</span>
            {index !== availableAssets.length - 1 && <span>, </span>}
          </div>
        </Tooltip>
      ));
    }

    const firstThreePools = availableAssets.slice(0, COLLATERAL_ITEMS_TO_SHOW);

    return (
      <Tooltip
        tooltipClassName="min-w-40 min-h-28 flex flex-col items-start justify-center"
        className="inline-flex flex-wrap whitespace-pre items-center cursor-pointer text-primary-20 underline text-xs prevent-row-click"
        content={<AssetTooltipContent pools={availableAssets} />}
        dataAttribute="lend-accepted-collateral-tooltip-asset"
        trigger={TooltipTrigger.click}
      >
        <div className="flex items-center">
          {firstThreePools.map((item, index) => (
            <div key={index}>
              <span>{item.toUpperCase()}</span>
              {index !== COLLATERAL_ITEMS_TO_SHOW - 1 && <span>, </span>}
            </div>
          ))}
          <div> {t(translations.lendPage.table.more)}</div>
        </div>
      </Tooltip>
    );
  }, [availableAssets]);

  return <>{renderPools}</>;
};
