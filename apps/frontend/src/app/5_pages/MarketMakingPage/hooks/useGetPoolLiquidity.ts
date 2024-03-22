import { useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useGetTokenContract } from '../../../../hooks/useGetContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';
import { COMMON_SYMBOLS } from '../../../../utils/asset';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useGetPoolLiquidity = (pool: AmmLiquidityPool) => {
  const [liquidity, setLiquidity] = useState<{
    balanceTokenA: Decimal;
    balanceTokenB: Decimal;
  }>({
    balanceTokenA: Decimal.ZERO,
    balanceTokenB: Decimal.ZERO,
  });

  const contractTokenA = useGetTokenContract(pool.assetA, RSK_CHAIN_ID);
  const contractTokenB = useGetTokenContract(COMMON_SYMBOLS.WBTC, RSK_CHAIN_ID);

  useEffect(() => {
    const fetchDataV1 = async () => {
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
          fetchBalance(contractTokenB, COMMON_SYMBOLS.WBTC),
        ]);

        setLiquidity({
          balanceTokenA: tokenBalance,
          balanceTokenB: btcBalance,
        });
      } catch (error) {
        console.error('Error fetching pool balance:', error);
      }
    };

    const fetchDataV2 = async () => {
      if (!contractTokenA || !contractTokenB) {
        return;
      }
      const provider = getProvider(RSK_CHAIN_ID);
      const contract = new Contract(
        pool.converter,
        pool.converterAbi,
        provider,
      );

      try {
        const fetchBalance = async (tokenContract: Contract) =>
          await asyncCall(
            `${
              pool.converter
            }/reserveStakedBalance/${tokenContract.address.toLowerCase()}`,
            () =>
              contract.reserveStakedBalance(
                tokenContract.address.toLowerCase(),
              ),
          ).then(Decimal.fromBigNumberString);

        const [tokenBalance, btcBalance] = await Promise.all([
          fetchBalance(contractTokenA),
          fetchBalance(contractTokenB),
        ]);

        setLiquidity({
          balanceTokenA: tokenBalance,
          balanceTokenB: btcBalance,
        });
      } catch (error) {
        console.error('Error fetching pool balance:', error);
      }
    };

    pool.converterVersion === 1 ? fetchDataV1() : fetchDataV2();
  }, [pool, contractTokenA, contractTokenB]);

  return liquidity;
};
