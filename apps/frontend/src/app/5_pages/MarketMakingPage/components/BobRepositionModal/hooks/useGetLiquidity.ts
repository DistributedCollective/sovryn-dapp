import { useCallback, useEffect, useState } from 'react';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { AmbientPosition } from '../../AmbientMarketMaking/AmbientMarketMaking.types';

export const useGetLiquidity = (position: AmbientPosition, poolIdx: number) => {
  const { croc } = useCrocContext();
  const { account } = useAccount();
  const [liquidity, setLiquidity] = useState('');

  const updateConcLiq = useCallback(async () => {
    if (!croc || !position) return;
    const pos = croc.positions(position.quote, position.base, account, poolIdx);

    const liquidity = (
      await pos.queryRangePos(position.bidTick, position.askTick)
    ).liq.toString();

    setLiquidity(liquidity);
  }, [croc, position, account, poolIdx]);

  useEffect(() => {
    updateConcLiq();
  }, [croc, position, updateConcLiq]);

  return { liquidity };
};
