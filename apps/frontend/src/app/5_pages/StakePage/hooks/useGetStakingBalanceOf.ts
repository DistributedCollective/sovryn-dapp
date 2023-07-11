import { useEffect, useState } from 'react';

import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../utils/chain';

export const useGetStakingBalanceOf = (address: string) => {
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    const getBalance = async () => {
      if (address && stakingContract) {
        const balance = await stakingContract.balanceOf(address);
        setBalance(balance.toString());
      }
    };

    getBalance();
  }, [balance, stakingContract, address]);

  return { balance };
};
