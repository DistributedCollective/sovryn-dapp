import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { getLoanTokenContract } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { defaultRskChainId } from '../../../../../../config/chains';

import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';

export const useGetLendingRewards = (account: string) => {
  const [lendingRewards, setLendingRewards] = useState(Decimal.ZERO);
  const [loading, setLoading] = useState(false);
  const liquidityMiningProxy = useGetProtocolContract('liquidityMiningProxy');

  const fetchUserAccumulatedReward = useCallback(
    async (poolAddress: string, account: string) =>
      await asyncCall(
        `liquidityMiningProxy/getUserAccumulatedReward/${poolAddress}/${account}`,
        () =>
          liquidityMiningProxy?.getUserAccumulatedReward(poolAddress, account),
      ),
    [liquidityMiningProxy],
  );

  useEffect(() => {
    const fetchReward = async () => {
      if (!account || !liquidityMiningProxy) {
        return;
      }

      setLoading(true);
      try {
        const dllrToken = await getLoanTokenContract(
          SupportedTokens.xusd,
          defaultRskChainId,
        );
        const btcToken = await getLoanTokenContract(
          SupportedTokens.rbtc,
          defaultRskChainId,
        );

        const [dllrPool, btcPool] = await Promise.all([
          fetchUserAccumulatedReward(dllrToken.address, account),
          fetchUserAccumulatedReward(btcToken.address, account),
        ]);

        setLendingRewards(
          Decimal.fromBigNumberString(dllrPool).add(
            Decimal.fromBigNumberString(btcPool),
          ),
        );
      } catch (error) {
        console.error('Error fetching accumulated reward:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReward();
  }, [account, liquidityMiningProxy, fetchUserAccumulatedReward]);

  return { lendingRewards, loading };
};
