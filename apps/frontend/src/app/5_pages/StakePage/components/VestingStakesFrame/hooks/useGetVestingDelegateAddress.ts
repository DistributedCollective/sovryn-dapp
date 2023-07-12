import { useEffect, useState } from 'react';

import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';
import { getRskChainId } from '../../../../../../utils/chain';

export const useGetVestingDelegateAddress = (
  vestingContractAddress: string,
  unlockDate: number,
) => {
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
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
