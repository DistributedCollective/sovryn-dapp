import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetNextSupplyInterestRate = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'lendTokens');
  const [interestRate, setInterestRate] = useState('0');

  const getInterestRate = useCallback(async () => {
    const interestRate = await lendContract?.nextSupplyInterestRate('0');
    if (interestRate) {
      setInterestRate(fromWei(interestRate));
    }
  }, [lendContract]);

  useEffect(() => {
    if (lendContract) {
      getInterestRate();
    }
  }, [getInterestRate, lendContract]);

  return { interestRate };
};
