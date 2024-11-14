import { useState, useEffect, useMemo } from 'react';

import { CrocReposition, priceToTick } from '@sovryn/sdex';
import { Pool } from '@sovryn/sdk';

import { decimalic } from '../../../../../../utils/math';
import { AmbientPosition } from '../../AmbientMarketMaking/AmbientMarketMaking.types';
import { useDepositContext } from '../../BobDepositModal/contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../BobDepositModal/hooks/useGetPoolInfo';
import { mintArgsForReposition } from '../BobRepositionModal.utils';

export const useGetBalances = (
  pool: Pool,
  position: AmbientPosition,
  rangeWidth: number,
) => {
  const { minimumPrice, maximumPrice } = useDepositContext();

  const [baseValue, setBaseValue] = useState('');
  const [quoteValue, setQuoteValue] = useState('');

  const { pool: crocPool } = useGetPoolInfo(pool);

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
