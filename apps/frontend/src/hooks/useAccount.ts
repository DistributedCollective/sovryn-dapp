import { useWalletConnect } from './useWalletConnect';

export const useAccount = () => {
  const { wallets } = useWalletConnect();

  return {
    account: wallets[0]?.accounts[0]?.address || '',
    provider: wallets[0]?.provider,
  };
};
