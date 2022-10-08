import { useCallback, useEffect, useState } from 'react';

import { startWith } from 'rxjs/operators';

import { WalletState } from '@sovryn/onboard-core';

import { onboard } from '../lib/connector';

export const useWalletConnect = () => {
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
  };
};
