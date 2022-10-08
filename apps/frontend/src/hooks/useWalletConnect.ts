import { useCallback, useEffect, useState } from 'react';

import { startWith } from 'rxjs/operators';

import { WalletState } from '@sovryn/onboard-core';
import { connectWallet$ } from '@sovryn/onboard-core/dist/streams';

import { onboard } from '../lib/connector';

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

  return {
    connectWallet,
    disconnectWallet,
    wallets,
    pending,
  };
};
