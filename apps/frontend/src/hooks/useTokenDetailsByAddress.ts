import { AssetDetailsData, getAssetDataByAddress } from '@sovryn/contracts';
import { useEffect, useState } from 'react';
import { RSK_CHAIN_ID } from '../config/chains';

export const useTokenDetailsByAddress = (address?: string) => {
  const [token, setToken] = useState<AssetDetailsData | undefined>();

  useEffect(() => {
    const getTokenDetails = () => {
      getAssetDataByAddress(address!, RSK_CHAIN_ID)
        .then(setToken)
        .catch(e => {
          console.error('token not found?', e);
        });
    };

    if (address) {
      getTokenDetails();
    }
  }, [address]);

  return token;
};
