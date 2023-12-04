import { useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { useGetTokenContract } from '../../../../hooks/useGetContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useGetLiquidity = (pool: AmmLiquidityPool) => {
  const [liquidity, setLiquidity] = useState<{
    balanceTokenA: Decimal;
    balanceTokenB: Decimal;
  }>({
    balanceTokenA: Decimal.ZERO,
    balanceTokenB: Decimal.ZERO,
  });

  const contractTokenA = useGetTokenContract(pool.assetA);
  const contractTokenB = useGetTokenContract(SupportedTokens.wrbtc);

  useEffect(() => {
    const fetchData = async () => {
      if (!contractTokenA || !contractTokenB) {
        return;
      }

      try {
        const fetchBalance = async (contract: Contract, type: string) =>
          await asyncCall(`${type}/balanceOf/${pool.converter}`, () =>
            contract.balanceOf(pool.converter),
          ).then(Decimal.fromBigNumberString);

        const [tokenBalance, btcBalance] = await Promise.all([
          fetchBalance(contractTokenA, pool.assetA),
          fetchBalance(contractTokenB, SupportedTokens.wrbtc),
        ]);

        setLiquidity({
          balanceTokenA: tokenBalance,
          balanceTokenB: btcBalance,
        });
      } catch (error) {
        console.error('Error fetching pool balance:', error);
      }
    };

    fetchData();
  }, [pool, contractTokenA, contractTokenB]);

  return liquidity;
};
