import { useCallback } from 'react';

import { useNotifyError } from './useNotifyError';

export const useAddTokenToWallet = (): {
  addTokenToWallet: (tokenAddress: string, chainId: string) => void;
} => {
  const { notifyError } = useNotifyError();

  const addTokenToWallet = useCallback(
    (tokenAddress: string, chainId: string) => {
      try {
        if (!(window as any)?.ethereum) {
          throw new Error('Wallet not available');
        }

        (window as any).ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              chainId,
              address: tokenAddress,
            },
          },
        });
      } catch (error) {
        notifyError(error);
      }
    },
    [notifyError],
  );

  return { addTokenToWallet };
};
