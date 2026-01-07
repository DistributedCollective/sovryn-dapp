import { useMemo } from 'react';

import { ethers } from 'ethers';

import { useWalletConnect } from './useWalletConnect';

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
    account: '0x951b976ca6a92b992323444aabff7270cdd078d6'.toLowerCase(),
    // account: wallets[0]?.accounts[0]?.address.toLowerCase() || '',
    type: wallets[0]?.label,
    eip1193Provider: wallets[0]?.provider,
    provider: web3provider,
    signer,
  };
};
