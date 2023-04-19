import { useCallback, useEffect, useState } from 'react';

import { ethers } from 'ethers';

import { getContract } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import { getRskChainId } from '../../../../utils/chain';

export const useGetSovGain = () => {
  const { signer, account } = useAccount();
  const [sovGain, setSOVGain] = useState('0');

  const updateSOVGain = useCallback(async () => {
    const { address, abi: stabilityPoolAbi } = await getContract(
      'stabilityPool',
      'zero',
      getRskChainId(),
    );
    const stabilityPool = new ethers.Contract(
      address,
      stabilityPoolAbi,
      signer,
    );

    const gain = await stabilityPool.getDepositorSOVGain(account);
    setSOVGain(gain.toString());
  }, [account, signer]);

  useEffect(() => {
    updateSOVGain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sovGain,
    updateSOVGain,
  };
};
