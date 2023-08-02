import { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';

export const useGetVestingsFish = () => {
  const { account } = useAccount();
  const [loadingVestingsFish, setLoadingVestingsFish] = useState(true); // Set initial state to true
  const vestingContract = useGetProtocolContract('vestingRegistryFish');
  const [vestingFishContract, setVestingFishContract] = useState('');

  const getVestingsFish = useCallback(async () => {
    if (!account) {
      setLoadingVestingsFish(false);
    }
    if (!account || !vestingContract) {
      return;
    }
    try {
      setLoadingVestingsFish(true);
      const contract = await vestingContract?.getVesting(account);
      if (contract) {
        setVestingFishContract(contract);
      }
    } catch (error) {
      console.error('Error fetching fish vesting contracts:', error);
    } finally {
      setLoadingVestingsFish(false);
    }
  }, [vestingContract, account]);

  useEffect(() => {
    getVestingsFish();
  }, [getVestingsFish]);

  return { vestingFishContract, loadingVestingsFish };
};
