import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Tooltip, TooltipTrigger } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { LendingPool } from '../../../../../utils/LendingPool';
import { AssetTooltipContent } from '../AssetTooltipComponent/AssetTooltipComponent';

const assetsToShow = 3;

type AcceptedCollateralProps = {
  pool: LendingPool;
};

export const AcceptedCollateral: FC<AcceptedCollateralProps> = ({ pool }) => {
  const availableAssets = useMemo(() => pool.getBorrowCollateral(), [pool]);

  const renderPools = useMemo(() => {
    if (!availableAssets.length) {
      return t(translations.common.na);
    }

    if (availableAssets.length <= assetsToShow) {
      return availableAssets.map((item, index) => (
        <Tooltip
          key={index}
          tooltipClassName="min-w-44 min-h-10"
          className="font-medium inline-flex whitespace-pre items-center cursor-pointer text-primary-20 underline text-xs w-auto prevent-row-click"
          content={<AssetTooltipContent asset={item} />}
          dataAttribute="borrow-accepted-collateral-tooltip-asset"
          trigger={TooltipTrigger.click}
        >
          <div>
            <span>{item.toUpperCase()}</span>
            {index !== availableAssets.length - 1 && <span>, </span>}
          </div>
        </Tooltip>
      ));
    }

    const poolsToShow = availableAssets.slice(0, assetsToShow);

    return (
      <Tooltip
        tooltipClassName="min-w-40 min-h-28 flex flex-col items-start justify-center"
        className="inline-flex flex-wrap whitespace-pre items-center cursor-pointer text-primary-20 underline text-xs prevent-row-click"
        content={<AssetTooltipContent pools={availableAssets} />}
        dataAttribute="borrow-accepted-collateral-tooltip-asset"
        trigger={TooltipTrigger.click}
      >
        <div className="flex items-center">
          {poolsToShow.map((item, index) => (
            <div key={index}>
              <span>{item.toUpperCase()}</span>
              {index !== assetsToShow && <span>, </span>}
            </div>
          ))}
          <div> {t(translations.common.more)}</div>
        </div>
      </Tooltip>
    );
  }, [availableAssets]);

  return <>{renderPools}</>;
};
