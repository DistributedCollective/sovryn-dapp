import { useEffect, useState } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';

const useGetFilteredDates = (vestingAddresses: string[]) => {
  const { account } = useAccount();
  const chainId = useCurrentChain();
  const stakingContract = useGetProtocolContract('staking', chainId);
  const [filteredDates, setFilteredDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchDatesForAddresses = async () => {
      if (!stakingContract) {
        return;
      }

      const datesArray: string[] = [];

      for (const address of vestingAddresses) {
        try {
          const res = await asyncCall(
            `staking/stakes/${account}`,
            () => stakingContract.getStakes(address),
            { force: true },
          );
          const dates = res['dates'];
          datesArray.push(...dates);
        } catch (error) {
          console.error('Error fetching dates for address', address, error);
        }
      }
      setFilteredDates(datesArray);
    };

    fetchDatesForAddresses();
  }, [vestingAddresses, stakingContract, account]);

  return filteredDates;
};

export default useGetFilteredDates;
