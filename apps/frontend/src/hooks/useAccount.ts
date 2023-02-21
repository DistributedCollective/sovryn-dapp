import { ethers } from 'ethers';

import { useWalletConnect } from './useWalletConnect';

export const useAccount = () => {
  const { wallets } = useWalletConnect();

  const web3provider = wallets[0]?.provider
    ? new ethers.providers.Web3Provider(wallets[0]?.provider)
    : undefined;
  const signer = web3provider?.getSigner();

  return {
    account: wallets[0]?.accounts[0]?.address || '',
    eip1193Provider: wallets[0]?.provider,
    provider: web3provider,
    signer,
  };
};
