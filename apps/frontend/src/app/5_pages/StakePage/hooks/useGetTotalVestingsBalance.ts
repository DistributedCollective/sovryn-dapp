import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';
import { decimalic } from '../../../../utils/math';
import { useGetVestings } from '../components/VestingStakesFrame/hooks/useGetVestings';

export const useGetTotalVestingsBalance = () => {
  const { vestingContracts, loadingVestings } = useGetVestings();
  const chainId = useCurrentChain();
  const stakingContract = useGetProtocolContract('staking', chainId);
  const [balance, setBalance] = useState(Decimal.ZERO);

  useEffect(() => {
    const getBalance = async (address: string) => {
      if (stakingContract) {
        const balance = await asyncCall(`staking/balance/${address}`, () =>
          stakingContract.balanceOf(address),
        );
        return balance ? Decimal.fromBigNumberString(balance) : Decimal.ZERO;
      }
      return Decimal.ZERO;
    };

    if (!loadingVestings && vestingContracts.length > 0) {
      vestingContracts.forEach(item => {
        getBalance(item.vestingAddress).then(result => {
          setBalance(prevResult => decimalic(prevResult).add(result));
        });
      });
    }
  }, [loadingVestings, stakingContract, vestingContracts]);

  return balance;
};
