import React, { FC, useMemo } from 'react';

import { Tooltip, TooltipPlacement, TooltipTrigger } from '@sovryn/ui';

import spiceInfo from '../../../../data/spiceInfo.json';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';
import { Spice } from './components/Spice/Spice';

type IncentivesProps = {
  pool: AmbientLiquidityPool;
};

type PoolSpiceInfo = {
  lpTokenAddress: string;
  label1: string;
  label2: string;
  content: string;
};

const poolsData = spiceInfo as PoolSpiceInfo[];

export const Incentives: FC<IncentivesProps> = ({ pool }) => {
  const poolData = useMemo(
    () =>
      poolsData.find(
        item =>
          item.lpTokenAddress.toLowerCase() ===
          pool.lpTokenAddress?.toLowerCase(),
      ),
    [pool.lpTokenAddress],
  );

  return poolData?.content || poolData?.label1 ? (
    <Tooltip
      content={<div>{poolData?.content}</div>}
      trigger={TooltipTrigger.click}
      placement={TooltipPlacement.right}
    >
      <div>
        <div className="flex">
          <div>{poolData?.label1}</div>
          <Spice />
        </div>

        <div className="flex">
          <div>{poolData?.label2}</div>
          <Spice />
        </div>
      </div>
    </Tooltip>
  ) : (
    <></>
  );
};
