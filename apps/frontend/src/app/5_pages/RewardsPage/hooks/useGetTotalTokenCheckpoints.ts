import { useCallback, useEffect, useState } from 'react';

import { getContract, SupportedTokens } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../utils/chain';

export const useGetTotalTokenCheckpoints = (token: SupportedTokens) => {
  const { account } = useAccount();
  const [maxCheckpoints, setMaxCheckpoints] = useState('');
  const feeSharing = useGetProtocolContract('feeSharing');

  const updateTotalTokenCheckpoints = useCallback(async () => {
    if (!feeSharing) {
      return;
    }
    const tokenContract = await getContract(token, 'tokens', getRskChainId());
    const checkpoints = await feeSharing.totalTokenCheckpoints(
      account ? tokenContract.address : null,
    );

    setMaxCheckpoints(checkpoints.toString());
  }, [account, feeSharing, token]);

  useEffect(() => {
    updateTotalTokenCheckpoints();
  }, [updateTotalTokenCheckpoints]);

  return { maxCheckpoints, updateTotalTokenCheckpoints };
};
