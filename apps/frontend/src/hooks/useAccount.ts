import { ethers } from 'ethers';

import { useWalletConnect } from './useWalletConnect';

export const useAccount = () => {
  const { wallets } = useWalletConnect();

  const web3provider = wallets[0]?.provider
    ? new ethers.providers.Web3Provider(wallets[0]?.provider)
    : undefined;
  const signer = web3provider?.getSigner();

  return {
    account: '0xaaa5a190accbc50f4f9c130b5876521e4d5f9d6c',
    eip1193Provider: wallets[0]?.provider,
    provider: web3provider,
    signer,
  };
};
