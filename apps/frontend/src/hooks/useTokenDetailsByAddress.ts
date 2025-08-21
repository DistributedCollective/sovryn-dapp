import { useEffect, useState } from 'react';

import { AssetDetailsData, getAssetDataByAddress } from '@sovryn/contracts';

import { useCurrentChain } from './useChainStore';

export const useTokenDetailsByAddress = (address?: string) => {
  const chainId = useCurrentChain();
  const [token, setToken] = useState<AssetDetailsData | undefined>();

  useEffect(() => {
    const getTokenDetails = () => {
      getAssetDataByAddress(address!, chainId)
        .then(setToken)
        .catch(e => {
          console.error('token not found?', e);
        });
    };

    if (address) {
      getTokenDetails();
    }
  }, [address, chainId]);

  return token;
};
