import { useEffect, useState } from 'react';

import { AssetDetailsData, getAssetData } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../config/chains';

export const useTokenDetailsByAsset = (asset?: string) => {
  const [token, setToken] = useState<AssetDetailsData | undefined>();

  useEffect(() => {
    if (asset) {
      getAssetData(asset!, RSK_CHAIN_ID)
        .then(setToken)
        .catch(e => {
          console.error('token not found?', e);
        });
    }
  }, [asset]);

  return token;
};
