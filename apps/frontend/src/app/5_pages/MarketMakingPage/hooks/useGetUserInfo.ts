import { useCallback, useEffect, useState } from 'react';

import { ethers } from 'ethers';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
} from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';
import { decimalic } from '../../../../utils/math';
import { UserInfo } from '../MarketMakingPage.types';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useGetUserInfo = (pool: AmmLiquidityPool) => {
  const { account } = useAccount();
  const { assetA, assetB, poolTokenA, poolTokenB } = pool;
  const [reward, setReward] = useState('0');
  const [balanceA, setBalanceA] = useState(Decimal.ZERO);
  const [loadingA, setLoadingA] = useState(false);
  const [balanceB, setBalanceB] = useState(Decimal.ZERO);
  const [loadingB, setLoadingB] = useState(false);
  const liquidityMiningProxy = useGetProtocolContract('liquidityMiningProxy');
  const babelfishAggregator = useGetProtocolContract('babelfishAggregator');

  const getUserInfo = useCallback(
    async (token: string) => {
      return await asyncCall(
        `liquidityMiningProxy/getUserInfo/${token}/${account}`,
        () => liquidityMiningProxy?.getUserInfo(token, account),
      ).then(res => ({
        amount: res?.amount || '0',
        reward: res?.accumulatedReward || '0',
      }));
    },
    [account, liquidityMiningProxy],
  );

  const getContract = useCallback(async (token: string) => {
    const { address, abi } = await getTokenContract(
      token === SupportedTokens.rbtc ? SupportedTokens.wrbtc : token,
      defaultChainId,
    );
    return new ethers.Contract(address, abi, getProvider(defaultChainId));
  }, []);

  const getBalance = useCallback(
    async (info: UserInfo, totalSupply: Decimal, converterBalance: Decimal) => {
      return decimalic(info.amount.toString())
        .div(totalSupply)
        .mul(converterBalance)
        .toNumber()
        .toFixed(0);
    },
    [],
  );

  useEffect(() => {
    if (!account || !liquidityMiningProxy || !babelfishAggregator) {
      return;
    }

    const getV1Balance = async () => {
      const info = await getUserInfo(poolTokenA);
      setReward(info.reward.toString());

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

      const getConverterBalanceA = await getContract(assetA);
      const getConverterBalanceB = await getContract(assetB);
      const converterBalanceA = await getConverterBalanceA
        .balanceOf(pool.converter)
        .then(Decimal.fromBigNumberString);
      const converterBalanceB = await getConverterBalanceB
        .balanceOf(pool.converter)
        .then(Decimal.fromBigNumberString);

      const balanceA = await getBalance(info, totalSupply, converterBalanceA);
      const balanceB = await getBalance(info, totalSupply, converterBalanceB);
      return {
        balanceA,
        balanceB,
      };
    };

    if (pool.converterVersion === 1) {
      setLoadingA(true);
      setLoadingB(true);
      getV1Balance()
        .then(result => {
          setBalanceA(decimalic(result.balanceA));
          setBalanceB(decimalic(result.balanceB));
          setLoadingA(false);
          setLoadingB(false);
        })
        .catch(console.error);
    }
  }, [
    account,
    assetA,
    assetB,
    babelfishAggregator,
    liquidityMiningProxy,
    pool.converter,
    pool.converterVersion,
    poolTokenA,
    poolTokenB,
    getContract,
    getBalance,
    getUserInfo,
  ]);

  return {
    balanceA,
    balanceB,
    loadingA,
    loadingB,
    reward,
  };
};
