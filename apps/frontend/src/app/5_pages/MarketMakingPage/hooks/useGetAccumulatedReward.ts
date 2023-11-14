import { useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import { defaultChainId } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { asyncCall } from '../../../../store/rxjs/provider-cache';

export const useGetAccumulatedReward = (poolToken: string) => {
  const { account } = useAccount();
  const [reward, setReward] = useState('0');

  useEffect(() => {
    const fetchReward = async () => {
      if (!account) return;

      const { abi, address } = await getProtocolContract(
        'liquidityMiningProxy',
        defaultChainId,
      );
      const contract = new Contract(address, abi, getProvider(defaultChainId));

      try {
        const userAccumulatedReward = await asyncCall(
          `liquidityMiningProxy/getUserAccumulatedReward/${poolToken}/${account}`,
          () => contract.getUserAccumulatedReward(poolToken, account),
        );

        setReward(userAccumulatedReward.toString());
      } catch (error) {
        console.error('Error fetching accumulated reward:', error);
      }
    };

    fetchReward();
  }, [account, poolToken]);

  return { reward };
};
