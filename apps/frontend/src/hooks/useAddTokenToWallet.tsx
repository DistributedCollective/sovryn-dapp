import { useCallback } from 'react';

import { useNotifyError } from './useNotifyError';

export const useAddTokenToWallet = (
  chainId: string,
): {
  addTokenToWallet: (tokenAddress: string) => void;
} => {
  const { notifyError } = useNotifyError();

  const addTokenToWallet = useCallback(
    (tokenAddress: string) => {
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
              symbol: 'vBOB',
              address: tokenAddress,
            },
          },
        });
      } catch (error) {
        console.log('error', error);
        notifyError(error);
      }
    },
    [notifyError, chainId],
  );

  return { addTokenToWallet };
};
