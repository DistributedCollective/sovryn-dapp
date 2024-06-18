import React from 'react';

import { formatUnits } from 'ethers/lib/utils';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { getTokenDisplayName } from '../../../../../../constants/tokens';
import { useTokenDetailsByAddress } from '../../../../../../hooks/useTokenDetailsByAddress';
import { LiquidityChange } from '../../../../../../utils/graphql/bob/generated';
import { decimalic } from '../../../../../../utils/math';

type BalanceChangeProps = {
  liquidityChange: LiquidityChange;
};

export const BalanceChange: React.FC<BalanceChangeProps> = ({
  liquidityChange,
}) => {
  const baseToken = useTokenDetailsByAddress(liquidityChange.pool.base);
  const quoteToken = useTokenDetailsByAddress(liquidityChange.pool.quote);

  return (
    <div className="flex items-center gap-2">
      <AmountRenderer
        value={formatUnits(
          (liquidityChange.changeType === 'mint'
            ? decimalic(liquidityChange.baseFlow)
            : decimalic(liquidityChange.baseFlow).mul(-1)
          ).toString(),
          baseToken?.decimals,
        ).toString()}
        suffix={getTokenDisplayName(baseToken?.symbol || '')}
        prefix={
          Number(liquidityChange.baseFlow) === 0
            ? ''
            : liquidityChange.changeType === 'mint'
            ? '+'
            : '-'
        }
      />

      <AmountRenderer
        value={formatUnits(
          (liquidityChange.changeType === 'mint'
            ? decimalic(liquidityChange.quoteFlow)
            : decimalic(liquidityChange.quoteFlow).mul(-1)
          ).toString(),
          quoteToken?.decimals,
        ).toString()}
        suffix={getTokenDisplayName(quoteToken?.symbol || '')}
        prefix={
          Number(liquidityChange.quoteFlow) === 0
            ? ''
            : liquidityChange.changeType === 'mint'
            ? '+'
            : '-'
        }
      />
    </div>
  );
};
