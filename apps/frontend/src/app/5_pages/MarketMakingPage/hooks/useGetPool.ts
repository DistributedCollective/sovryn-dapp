import { useMemo } from 'react';

import { Pool } from '@sovryn/sdk';

import { useCrocContext } from '../../../../contexts/CrocContext';

export const useGetPool = (p: Pool) => {
  const { croc } = useCrocContext();

  const poolTokens = useMemo(() => {
    if (!croc) {
      return;
    }

    const tokenA = croc.tokens.materialize(p.base.address);
    const tokenB = croc.tokens.materialize(p.quote.address);

    return { tokenA, tokenB, poolIndex: p.extra.poolIdx };
  }, [croc, p.base.address, p.extra.poolIdx, p.quote.address]);

  const pool = useMemo(() => {
    if (!poolTokens || !croc) {
      return;
    }

    return croc.pool(
      poolTokens.tokenA.tokenAddr,
      poolTokens.tokenB.tokenAddr,
      poolTokens.poolIndex,
    );
  }, [croc, poolTokens]);

  return {
    pool,
    poolTokens,
  };
};
