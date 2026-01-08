import { useMemo } from 'react';

import { ethers } from 'ethers';

import { useWalletConnect } from './useWalletConnect';
import { maybeDebugAccount } from '../utils/account-debug';

export const useAccount = () => {
  const { wallets } = useWalletConnect();

  const web3provider = useMemo(
    () =>
      wallets[0]?.provider
        ? new ethers.providers.Web3Provider(wallets[0]?.provider)
        : undefined,
    [wallets],
  );
  const signer = useMemo(() => web3provider?.getSigner(), [web3provider]);

  return {
    account: maybeDebugAccount(wallets[0]?.accounts[0]?.address),
    type: wallets[0]?.label,
    eip1193Provider: wallets[0]?.provider,
    provider: web3provider,
    signer,
  };
};
