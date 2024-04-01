import { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';
import { VestingData } from '../VestingStakesFrame.types';

export const useGetVestings = () => {
  const { account } = useAccount();
  const chainId = useCurrentChain();
  const vestingContract = useGetProtocolContract('vestingRegistry', chainId);
  const [vestingContracts, setVestingContracts] = useState<VestingData[]>([]);
  const [loadingVestings, setLoadingVestings] = useState(true); // Set initial state to true

  const getVestings = useCallback(async () => {
    if (!account) {
      setLoadingVestings(false);
    }
    if (!account || !vestingContract) {
      return;
    }
    try {
      setLoadingVestings(true);
      const contracts = await asyncCall(`vesting/stakes/${account}`, () =>
        vestingContract.getVestingsOf(account),
      );
      if (contracts) {
        setVestingContracts(contracts);
      }
    } catch (error) {
      console.error('Error fetching vesting contracts:', error);
    } finally {
      setLoadingVestings(false);
    }
  }, [vestingContract, account]);

  useEffect(() => {
    getVestings();
  }, [getVestings]);

  return { vestingContracts, loadingVestings };
};
