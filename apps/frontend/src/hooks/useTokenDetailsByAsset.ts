import { useEffect, useState } from 'react';

import { AssetDetailsData, getAssetData } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../config/chains';

export const useTokenDetailsByAsset = (
  asset?: string,
  chainId = RSK_CHAIN_ID,
): AssetDetailsData | undefined => {
  const [token, setToken] = useState<AssetDetailsData | undefined>();

  useEffect(() => {
    if (asset) {
      getAssetData(asset!, chainId)
        .then(setToken)
        .catch(e => {
          console.error('token not found?', asset, chainId, e);
        });
    }
  }, [asset, chainId]);

  return token;
};
