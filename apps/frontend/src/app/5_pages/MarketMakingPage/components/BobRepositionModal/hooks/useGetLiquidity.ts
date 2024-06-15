import { useCallback, useEffect, useState } from 'react';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { AmbientPosition } from '../../AmbientMarketMaking/AmbientMarketMaking.types';

export const useGetLiquidity = (position: AmbientPosition) => {
  const { croc } = useCrocContext();

  const [liquidity, setLiquidity] = useState('');

  const updateConcLiq = useCallback(async () => {
    if (!croc || !position) return;
    const pos = croc.positions(
      position.quote,
      position.base,
      position.user,
      position.poolIdx,
    );

    const liquidity = (
      await pos.queryRangePos(position.bidTick, position.askTick)
    ).liq.toString();

    setLiquidity(liquidity);
  }, [croc, position]);

  useEffect(() => {
    updateConcLiq();
  }, [croc, position, updateConcLiq]);

  return { liquidity };
};
