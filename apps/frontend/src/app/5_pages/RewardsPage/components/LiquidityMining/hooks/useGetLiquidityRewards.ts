import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';

export const useGetLiquidityRewards = (account: string) => {
  const [vestedRewards, setVestedRewards] = useState(Decimal.ZERO);
  const [liquidRewards, setLiquidRewards] = useState(Decimal.ZERO);
  const [loading, setLoading] = useState(false);
  const liquidityMiningProxy = useGetProtocolContract('liquidityMiningProxy');

  useEffect(() => {
    const fetchData = async () => {
      if (!liquidityMiningProxy || !account) {
        return;
      }

      setLoading(true);
      try {
        const [vested, liquid] = await Promise.all([
          liquidityMiningProxy.getUserAccumulatedRewardToBeVested(account),
          liquidityMiningProxy.getUserAccumulatedRewardToBePaidLiquid(account),
        ]);

        setVestedRewards(Decimal.fromBigNumberString(vested));
        setLiquidRewards(Decimal.fromBigNumberString(liquid));
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account, liquidityMiningProxy]);

  return { vestedRewards, liquidRewards, loading };
};
