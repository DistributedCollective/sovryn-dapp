import { useCallback, useEffect, useState } from 'react';

import { ethers } from 'ethers';

import { SupportedTokens, getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import {
  useGetProtocolContract,
  useGetTokenContract,
} from '../../../../hooks/useGetContract';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useGetUserInfo = (pool: AmmLiquidityPool) => {
  const { account } = useAccount();
  const { assetA, poolTokenA } = pool;
  const [reward, setReward] = useState<Decimal>(Decimal.ZERO);
  const [balanceA, setBalanceA] = useState<Decimal>(Decimal.ZERO);
  const [loadingA, setLoadingA] = useState(false);
  const [balanceB, setBalanceB] = useState<Decimal>(Decimal.ZERO);
  const [loadingB, setLoadingB] = useState(false);
  const liquidityMiningProxy = useGetProtocolContract('liquidityMiningProxy');
  const contractTokenA = useGetTokenContract(assetA, defaultChainId);
  const contractTokenB = useGetTokenContract(
    SupportedTokens.wrbtc,
    defaultChainId,
  );

  const getUserInfo = useCallback(
    async (token: string) =>
      liquidityMiningProxy
        ?.getUserInfo(token, account)
        .then(({ amount, accumulatedReward }) => ({
          amount: Decimal.fromBigNumberString(amount),
          reward: Decimal.fromBigNumberString(accumulatedReward),
        })),
    [account, liquidityMiningProxy],
  );

  const fetch = useCallback(() => {
    if (!liquidityMiningProxy || !account) {
      return;
    }
    const getV1Balance = async () => {
      const info = await getUserInfo(poolTokenA);
      setReward(info.reward);

      const { abi } = await getProtocolContract(
        'babelfishAggregator',
        defaultChainId,
      );
      const contract = new ethers.Contract(
        poolTokenA,
        abi,
        getProvider(defaultChainId),
      );

      const totalSupply = await contract
        .totalSupply()
        .then(Decimal.fromBigNumberString);
      const converterBalanceA = await contractTokenA
        ?.balanceOf(pool.converter)
        .then(Decimal.fromBigNumberString);
      const converterBalanceB = await contractTokenB
        ?.balanceOf(pool.converter)
        .then(Decimal.fromBigNumberString);

      const balanceA = info.amount.div(totalSupply).mul(converterBalanceA);
      const balanceB = info.amount.div(totalSupply).mul(converterBalanceB);

      return {
        balanceA,
        balanceB,
      };
    };

    if (pool.converterVersion === 1 && contractTokenA && contractTokenB) {
      setLoadingA(true);
      setLoadingB(true);
      getV1Balance()
        .then(({ balanceA, balanceB }) => {
          setBalanceA(balanceA);
          setBalanceB(balanceB);
        })
        .finally(() => {
          setLoadingA(false);
          setLoadingB(false);
        })
        .catch(console.error);
    }
  }, [
    account,
    liquidityMiningProxy,
    pool.converter,
    pool.converterVersion,
    poolTokenA,
    getUserInfo,
    contractTokenA,
    contractTokenB,
  ]);

  useEffect(() => fetch(), [fetch]);

  return {
    balanceA,
    balanceB,
    loadingA,
    loadingB,
    reward,
    refetch: fetch,
  };
};
