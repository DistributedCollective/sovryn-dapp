import { useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetTokenContract } from '../../../../hooks/useGetContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useGetPoolLiquidity = (pool: AmmLiquidityPool) => {
  const [liquidity, setLiquidity] = useState<{
    balanceTokenA: Decimal;
    balanceTokenB: Decimal;
  }>({
    balanceTokenA: Decimal.ZERO,
    balanceTokenB: Decimal.ZERO,
  });

  const { signer } = useAccount();
  const contractTokenA = useGetTokenContract(pool.assetA, defaultChainId);
  const contractTokenB = useGetTokenContract(
    SupportedTokens.wrbtc,
    defaultChainId,
  );

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

    const fetchDataV2 = async () => {
      if (!signer || !contractTokenA || !contractTokenB) {
        return;
      }
      const contract = new Contract(pool.converter, pool.converterAbi, signer);

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

        // await contract
        //   .reserveStakedBalance(tokenContract.address.toLowerCase())
        //   .then(Decimal.fromBigNumberString);

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
  }, [pool, contractTokenA, contractTokenB, signer]);

  return liquidity;
};
