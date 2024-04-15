import { useCallback, useEffect, useState } from 'react';

import { Contract, ethers } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import {
  useGetProtocolContract,
  useGetTokenContract,
} from '../../../../hooks/useGetContract';
import { COMMON_SYMBOLS } from '../../../../utils/asset';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useGetUserInfo = (pool: AmmLiquidityPool) => {
  const { account, signer } = useAccount();
  const { assetA, poolTokenA, poolTokenB } = pool;
  const [reward, setReward] = useState<Decimal>(Decimal.ZERO);
  const [balanceA, setBalanceA] = useState<Decimal>(Decimal.ZERO);
  const [loadingA, setLoadingA] = useState(false);
  const [balanceB, setBalanceB] = useState<Decimal>(Decimal.ZERO);
  const [loadingB, setLoadingB] = useState(false);
  const chainId = useCurrentChain();
  const liquidityMiningProxy = useGetProtocolContract(
    'liquidityMiningProxy',
    chainId,
  );
  const contractTokenA = useGetTokenContract(assetA, chainId);
  const contractTokenB = useGetTokenContract(COMMON_SYMBOLS.WBTC, chainId);

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

  const getBalance = useCallback(
    async (token: string, amount: string) => {
      const contract = new Contract(pool.converter, pool.converterAbi, signer);

      const { 0: balance } = await contract.removeLiquidityReturnAndFee(
        token,
        amount,
      );

      return Decimal.fromBigNumberString(balance);
    },
    [pool.converter, pool.converterAbi, signer],
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
        RSK_CHAIN_ID,
      );
      const contract = new ethers.Contract(
        poolTokenA,
        abi,
        getProvider(RSK_CHAIN_ID),
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

    const getV2Balance = async (token: string) => {
      const info = await getUserInfo(token);
      setReward(info.reward);
      return await getBalance(token, info.amount);
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
    } else if (pool.converterVersion === 2 && poolTokenB) {
      setLoadingA(true);
      setLoadingB(true);
      getV2Balance(poolTokenA)
        .then(result => {
          setBalanceA(result);
        })
        .finally(() => {
          setLoadingA(false);
        });
      getV2Balance(poolTokenB)
        .then(result => {
          setBalanceB(result);
        })
        .finally(() => {
          setLoadingB(false);
        });
    }
  }, [
    liquidityMiningProxy,
    account,
    pool.converterVersion,
    pool.converter,
    contractTokenA,
    contractTokenB,
    poolTokenB,
    getUserInfo,
    poolTokenA,
    getBalance,
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
