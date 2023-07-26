import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetTokenPrice = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens');
  const [tokenPrice, setTokenPrice] = useState('0');

  const getTokenPrice = useCallback(async () => {
    const price = await lendContract?.tokenPrice();
    if (price) {
      setTokenPrice(fromWei(price));
    }
  }, [lendContract]);

  useEffect(() => {
    if (lendContract) {
      getTokenPrice();
    }
  }, [getTokenPrice, lendContract]);

  return { tokenPrice };
};
