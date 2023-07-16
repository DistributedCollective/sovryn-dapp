import { useEffect, useState } from 'react';

import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';

export const useGetStakingBalanceOf = (address: string) => {
  const stakingContract = useGetProtocolContract('staking');
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const getBalance = async () => {
      if (address && stakingContract) {
        const balance = await asyncCall(`staking/balance/${address}`, () =>
          stakingContract.balanceOf(address),
        );
        setBalance(balance.toString());
      }
    };

    getBalance();
  }, [balance, stakingContract, address]);

  return { balance };
};
