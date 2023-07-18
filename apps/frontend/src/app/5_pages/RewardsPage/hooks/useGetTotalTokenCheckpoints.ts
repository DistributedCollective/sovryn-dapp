import { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';

export const useGetTotalTokenCheckpoints = (contractAddress: string) => {
  const { account } = useAccount();
  const [maxCheckpoints, setMaxCheckpoints] = useState('');
  const feeSharing = useGetProtocolContract('feeSharing');

  const updateTotalTokenCheckpoints = useCallback(async () => {
    if (!feeSharing || !contractAddress) {
      return;
    }
    const checkpoints = await feeSharing.totalTokenCheckpoints(
      account ? contractAddress : null,
    );

    setMaxCheckpoints(checkpoints.toString());
  }, [account, feeSharing, contractAddress]);

  useEffect(() => {
    updateTotalTokenCheckpoints();
  }, [updateTotalTokenCheckpoints]);

  return { maxCheckpoints, updateTotalTokenCheckpoints };
};
