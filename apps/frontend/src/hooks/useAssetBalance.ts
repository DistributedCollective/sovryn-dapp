import { useEffect, useMemo, useState } from 'react';

import { constants, Contract } from 'ethers';
import { Subscription } from 'zen-observable-ts';

import { getTokenDetails, SupportedTokens } from '@sovryn/contracts';
import { ChainId, getProvider } from '@sovryn/ethers-provider';

import {
  CacheCallOptions,
  CacheCallResponse,
  idHash,
  observeCall,
  startCall,
} from '../store/rxjs/provider-cache';
import { getRskChainId } from '../utils/chain';
import { useBlockNumber } from './useBlockNumber';
import { useIsMounted } from './useIsMounted';
import { useWalletConnect } from './useWalletConnect';

export const useAssetBalance = (
  asset: SupportedTokens,
  chainId: ChainId = getRskChainId(),
  walletIndex: number = 0,
  options?: Partial<CacheCallOptions>,
): CacheCallResponse<string> => {
  const { wallets } = useWalletConnect();
  const isMounted = useIsMounted();
  const blockNumber = useBlockNumber();

  const account = useMemo(
    () => wallets[walletIndex]?.accounts[0]?.address,
    [walletIndex, wallets],
  );

  const [state, setState] = useState<CacheCallResponse<string>>({
    value: '0',
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
        blockNumber,
        tokenDetails.address,
        tokenDetails.address === constants.AddressZero
          ? 'nativeBalance'
          : 'balanceOf',
        account,
      ]);

      sub = observeCall(hashedArgs).subscribe(e => setState(e.result));

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
              ).balanceOf(account);

      startCall(hashedArgs, callback, options);
    };

    runAsync().catch(e => setState({ value: '0', loading: false, error: e }));

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [account, asset, chainId, blockNumber, isMounted, options]);

  return useMemo(
    () => ({ ...state, value: state.value === null ? '0' : state.value }),
    [state],
  );
};
