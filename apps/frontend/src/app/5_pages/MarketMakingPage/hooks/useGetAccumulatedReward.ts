import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';

export const useGetAccumulatedReward = (poolToken: string) => {
  const { account } = useAccount();
  const [reward, setReward] = useState<Decimal>(Decimal.ZERO);
  const liquidityMiningProxy = useGetProtocolContract('liquidityMiningProxy');
  useEffect(() => {
    const fetchReward = async () => {
      if (!liquidityMiningProxy) {
        return;
      }
      try {
        const userAccumulatedReward = await asyncCall(
          `liquidityMiningProxy/getUserAccumulatedReward/${poolToken}/${account}`,
          () =>
            liquidityMiningProxy.getUserAccumulatedReward(poolToken, account),
        ).then(Decimal.fromBigNumberString);
        setReward(userAccumulatedReward);
      } catch (error) {
        console.error('Error fetching accumulated reward:', error);
      }
    };

    if (account && poolToken) {
      fetchReward();
    }
  }, [account, poolToken, liquidityMiningProxy]);

  return { reward };
};
