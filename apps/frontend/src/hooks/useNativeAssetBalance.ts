import { useEffect, useMemo, useState } from 'react';

import { BigNumber, constants } from 'ethers';
import { Subscription } from 'zen-observable-ts';

import { ChainId, getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../config/chains';

import {
  CacheCallOptions,
  idHash,
  observeCall,
  startCall,
} from '../store/rxjs/provider-cache';
import { findNativeAsset } from '../utils/asset';
import { fromWei, decimalic } from '../utils/math';
import { useBlockNumber } from './useBlockNumber';
import { useIsMounted } from './useIsMounted';
import { useWalletConnect } from './useWalletConnect';

export type AssetBalanceResponse = {
  balance: Decimal;
  weiBalance: string;
  bigNumberBalance: BigNumber;
  decimalPrecision?: number;
  loading: boolean;
  error: Error | null;
  hashedArgs?: string;
};

export const useNativeAssetBalance = (
  chainId: ChainId = RSK_CHAIN_ID,
  address: string | null = null,
  walletIndex: number = 0,
  options?: Partial<CacheCallOptions>,
): AssetBalanceResponse => {
  const { value: block } = useBlockNumber(chainId);
  const { wallets } = useWalletConnect();
  const isMounted = useIsMounted();

  const account = useMemo(
    () =>
      address === null ? wallets[walletIndex]?.accounts[0]?.address : address,
    [address, walletIndex, wallets],
  );

  const [state, setState] = useState<AssetBalanceResponse>({
    balance: Decimal.ZERO,
    weiBalance: '0',
    bigNumberBalance: BigNumber.from(0),
    loading: false,
    error: null,
    hashedArgs: '',
  });

  useEffect(() => {
    if (!isMounted() || !account) {
      return;
    }

    let sub: Subscription;

    const runAsync = async () => {
      const tokenDetails = findNativeAsset(chainId);

      const hashedArgs = idHash([
        'balance',
        chainId,
        constants.AddressZero,
        'balanceOf',
        account,
      ]);

      if (hashedArgs === state.hashedArgs || state.loading) {
        return;
      }

      setState(prevState => ({
        ...prevState,
        hashedArgs,
        loading: true,
      }));

      sub = observeCall(hashedArgs).subscribe(e => {
        const decimal = decimalic(
          fromWei(
            e.result.value === null ? 0 : e.result.value,
            tokenDetails.decimals,
          ),
        );
        const bn = decimal.toBigNumber();
        setState({
          ...e.result,
          weiBalance: bn.toString(),
          bigNumberBalance: bn,
          balance: decimal,
          decimalPrecision: tokenDetails.decimals,
          loading: false,
        });
      });

      const callback = () =>
        getProvider(chainId)
          .getBalance(account)
          .then(result => result.toString());

      startCall(hashedArgs, callback, {
        ...options,
        blockNumber: options?.blockNumber || block,
      });
    };

    runAsync().catch(e =>
      setState(prev => ({
        ...prev,
        weiBalance: '0',
        balance: Decimal.ZERO,
        bigNumberBalance: BigNumber.from(0),
        loading: false,
        error: e,
        hashedArgs: '',
      })),
    );

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [
    account,
    chainId,
    isMounted,
    options,
    block,
    state.hashedArgs,
    state.loading,
  ]);

  return useMemo(
    () => ({
      ...state,
      weiBalance: state.weiBalance === null ? '0' : state.weiBalance,
      bigNumberBalance:
        state.weiBalance === null ? BigNumber.from(0) : state.bigNumberBalance,
    }),
    [state],
  );
};
