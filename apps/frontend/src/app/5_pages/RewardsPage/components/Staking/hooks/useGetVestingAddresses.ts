import { useEffect, useState } from 'react';

import { useGetVestingStakes } from '../../../../StakePage/components/VestingStakesFrame/hooks/useGetVestingStakes';

const useGetVestingAddresses = () => {
  const { vestingStakes, loadingVestings } = useGetVestingStakes();

  const [vestingAddresses, setVestingAddresses] = useState<string[]>([]);

  useEffect(() => {
    const getVestingContractAddresses = async () => {
      try {
        const vestingContracts: string[] = await Promise.all(
          vestingStakes.map(async item => item.vestingContract),
        );
        setVestingAddresses(vestingContracts);
      } catch (error) {
        console.error('Error fetching vesting contract addresses:', error);
      }
    };
    if (!loadingVestings) {
      getVestingContractAddresses();
    }
  }, [vestingStakes, loadingVestings]);

  return vestingAddresses;
};

export default useGetVestingAddresses;
