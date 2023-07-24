import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetMarketLiquidity = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'lendTokens');
  const [availableAmount, setAvailableAmount] = useState('0');

  const getMarketLiquidity = useCallback(async () => {
    const amount = await lendContract?.marketLiquidity();
    if (amount) {
      setAvailableAmount(fromWei(amount));
    }
  }, [lendContract]);

  useEffect(() => {
    getMarketLiquidity();
  }, [getMarketLiquidity]);

  return { availableAmount };
};
