import { useCallback, useEffect, useMemo, useState } from 'react';

import { startWith } from 'rxjs/operators';

import { ChainId } from '@sovryn/ethers-provider';
import { WalletState } from '@sovryn/onboard-core';
import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';

import { onboard } from '../lib/connector';
import { maybeDebugAccount } from '../utils/account-debug';

export const useWalletConnect = () => {
  const [pending, setPending] = useState(false);
  const [wallets, setWallets] = useState<WalletState[]>(
    onboard.state.get().wallets,
  );

  const connectWallet = useCallback(() => {
    onboard.connectWallet();
  }, []);
  const disconnectWallet = useCallback(async () => {
    await onboard.disconnectWallet();
  }, []);

  const switchNetwork = useCallback(
    (chainId: ChainId) =>
      onboard.setChain({
        chainId,
      }),
    [],
  );

  useEffect(() => {
    const sub = connectWallet$
      .asObservable()
      .subscribe(({ inProgress }) => setPending(inProgress));
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    const sub = onboard.state
      .select('wallets')
      .pipe(startWith(onboard.state.get().wallets))
      .subscribe(setWallets);
    return () => sub.unsubscribe();
  }, []);

  const account = useMemo(
    () => maybeDebugAccount(wallets[0]?.accounts[0]?.address),
    [wallets],
  );

  const getWallet = useCallback((index: number) => wallets[index], [wallets]);

  const getAccount = useCallback(
    (index: number) => wallets[index]?.accounts[0]?.address,
    [wallets],
  );

  return {
    connectWallet,
    disconnectWallet,
    wallets,
    account,
    pending,
    switchNetwork,
    getAccount,
    getWallet,
  };
};
