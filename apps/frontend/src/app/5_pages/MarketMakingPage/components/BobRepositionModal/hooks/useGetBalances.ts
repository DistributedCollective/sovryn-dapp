import { useState, useEffect, useMemo } from 'react';

import { CrocReposition, priceToTick } from '@sovryn/sdex';

import { decimalic } from '../../../../../../utils/math';
import { AmbientPosition } from '../../AmbientMarketMaking/AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { useDepositContext } from '../../BobDepositModal/contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../BobDepositModal/hooks/useGetPoolInfo';
import { mintArgsForReposition } from '../BobRepositionModal.utils';

export const useGetBalances = (
  pool: AmbientLiquidityPool,
  position: AmbientPosition,
  rangeWidth: number,
) => {
  const { minimumPrice, maximumPrice } = useDepositContext();

  const [baseValue, setBaseValue] = useState('');
  const [quoteValue, setQuoteValue] = useState('');
  const { base, quote } = useMemo(() => pool, [pool]);

  const { pool: crocPool } = useGetPoolInfo(base, quote);

  const lowTick = useMemo(() => priceToTick(minimumPrice), [minimumPrice]);
  const highTick = useMemo(() => priceToTick(maximumPrice), [maximumPrice]);

  useEffect(() => {
    if (
      position &&
      Math.abs(lowTick) !== Infinity &&
      Math.abs(highTick) !== Infinity &&
      crocPool
    ) {
      const reposition = new CrocReposition(crocPool, {
        liquidity: decimalic(position.concLiq).toString(),
        burn: [position.bidTick, position.askTick],
        mint: mintArgsForReposition(lowTick, highTick, rangeWidth),
      });

      reposition.postBalance().then(([base, quote]) => {
        setBaseValue(base.toString());
        setQuoteValue(quote.toString());
      });
    }
  }, [position, crocPool, lowTick, highTick, rangeWidth]);

  return [baseValue, quoteValue];
};
