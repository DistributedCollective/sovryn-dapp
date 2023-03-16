import { useEffect, useMemo, useState } from 'react';

import { BigNumber, constants, Contract } from 'ethers';
import { Subscription } from 'zen-observable-ts';

import { getTokenDetails, SupportedTokens } from '@sovryn/contracts';
import { ChainId, getProvider } from '@sovryn/ethers-provider';

import {
  CacheCallOptions,
  idHash,
  observeCall,
  startCall,
} from '../store/rxjs/provider-cache';
import { getRskChainId } from '../utils/chain';
import { bn, fromWei, ZERO } from '../utils/math';
import { useBlockNumber } from './useBlockNumber';
import { useIsMounted } from './useIsMounted';
import { useWalletConnect } from './useWalletConnect';

export type AssetBalanceResponse = {
  balance: string;
  weiBalance: string;
  bigNumberBalance: BigNumber;
  decimalPrecision?: number;
  loading: boolean;
  error: Error | null;
};

export const useAssetBalance = (
  asset: SupportedTokens,
  chainId: ChainId = getRskChainId(),
  address: string | null = null,
  walletIndex: number = 0,
  options?: Partial<CacheCallOptions>,
): AssetBalanceResponse => {
  const { value: block } = useBlockNumber(chainId);
  const { wallets } = useWalletConnect();
  const isMounted = useIsMounted();

  const account = useMemo(
    () => address || wallets[walletIndex]?.accounts[0]?.address,
    [address, walletIndex, wallets],
  );

  const [state, setState] = useState<AssetBalanceResponse>({
    balance: '0',
    weiBalance: '0',
    bigNumberBalance: ZERO,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!isMounted() || !account) {
      return;
    }

    let sub: Subscription;

    const runAsync = async () => {
      const tokenDetails = await getTokenDetails(asset, chainId);

      const hashedArgs = idHash([
        tokenDetails.address,
        tokenDetails.address === constants.AddressZero
          ? 'nativeBalance'
          : 'balanceOf',
        account,
      ]);

      sub = observeCall(hashedArgs).subscribe(e =>
        setState({
          ...e.result,
          weiBalance: e.result.value,
          bigNumberBalance: bn(e.result.value),
          balance: fromWei(
            e.result.value === null ? 0 : e.result.value,
            tokenDetails.decimalPrecision,
          ),
          decimalPrecision: tokenDetails.decimalPrecision,
        }),
      );

      const callback =
        tokenDetails.address === constants.AddressZero
          ? () =>
              getProvider(chainId)
                .getBalance(account)
                .then(result => result.toString())
          : () =>
              new Contract(
                tokenDetails.address,
                tokenDetails.abi,
                getProvider(chainId),
              )
                .balanceOf(account)
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
        balance: '0',
        bigNumberBalance: ZERO,
        loading: false,
        error: e,
      })),
    );

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [account, asset, chainId, isMounted, options, block]);

  return useMemo(
    () => ({
      ...state,
      weiBalance: state.weiBalance === null ? '0' : state.weiBalance,
      bigNumberBalance:
        state.weiBalance === null ? ZERO : state.bigNumberBalance,
    }),
    [state],
  );
};
