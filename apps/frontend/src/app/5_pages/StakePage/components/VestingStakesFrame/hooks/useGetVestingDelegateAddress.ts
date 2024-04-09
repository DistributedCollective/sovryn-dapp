import { useEffect, useState } from 'react';

import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';

export const useGetVestingDelegateAddress = (
  vestingContractAddress: string,
  unlockDate: number,
) => {
  const chainId = useCurrentChain();
  const stakingContract = useGetProtocolContract('staking', chainId);
  const [delegatedAddress, setDelegatedAddress] = useState('');

  useEffect(() => {
    const getDelegatedAddress = async () => {
      if (unlockDate !== 0 && stakingContract) {
        const address = await asyncCall(
          `staking/delegates/${vestingContractAddress}/${unlockDate}`,
          () => stakingContract.delegates(vestingContractAddress, unlockDate),
        );
        if (address) {
          setDelegatedAddress(address);
        }
      }
    };

    getDelegatedAddress();
  }, [unlockDate, stakingContract, vestingContractAddress]);

  return delegatedAddress;
};
