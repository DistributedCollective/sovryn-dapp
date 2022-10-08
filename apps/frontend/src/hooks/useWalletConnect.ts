import { useCallback, useEffect, useState } from 'react';

import { WalletState } from '@sovryn/onboard-core';

import { onboard } from '../lib/connector';

export const useWalletConnect = () => {
  const [wallets, setWallets] = useState<WalletState[]>([]);

  const connectWallet = useCallback(() => {
    onboard.connectWallet();
  }, []);
  const disconnectWallet = useCallback(async () => {
    await onboard.disconnectWallet(wallets[0].label);
  }, [wallets]);

  useEffect(() => {
    const sub = onboard.state.select('wallets').subscribe(setWallets);
    return () => sub.unsubscribe();
  }, []);

  return {
    connectWallet,
    disconnectWallet,
    wallets,
  };
};
