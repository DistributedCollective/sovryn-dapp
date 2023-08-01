import { useEffect, useRef, useState } from 'react';

import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';

export const useGetStakingBalanceOf = (address: string) => {
  const stakingContract = useGetProtocolContract('staking');
  const [balance, setBalance] = useState('0');

  const { value: block } = useBlockNumber();
  const prevBlockRef = useRef<number | undefined>(block);

  useEffect(() => {
    const getBalance = async () => {
      if (address && stakingContract) {
        const balance = await asyncCall(
          `staking/balance/${address}`,
          () => stakingContract.balanceOf(address),
          {
            force: true,
          },
        );
        setBalance(balance.toString());
      }
    };

    if (prevBlockRef.current !== block) {
      getBalance();
    }

    prevBlockRef.current = block;
  }, [balance, stakingContract, address, block]);

  return { balance };
};
