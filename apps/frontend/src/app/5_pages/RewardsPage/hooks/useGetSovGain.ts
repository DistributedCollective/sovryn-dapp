import { useCallback, useEffect, useState } from 'react';

import { formatUnits } from 'ethers/lib/utils';

import { useAccount } from '../../../../hooks/useAccount';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { getRskChainId } from '../../../../utils/chain';

export const useGetSovGain = () => {
  const { account } = useAccount();
  const [sovGain, setSOVGain] = useState('0');

  const stabilityPool = useLoadContract(
    'stabilityPool',
    'zero',
    getRskChainId(),
  );

  const updateSOVGain = useCallback(async () => {
    const gain = await stabilityPool?.getDepositorSOVGain(account);
    setSOVGain(formatUnits(gain.toString()));
  }, [account, stabilityPool]);

  useEffect(() => {
    updateSOVGain();
  }, [updateSOVGain]);

  return {
    sovGain,
    updateSOVGain,
  };
};
