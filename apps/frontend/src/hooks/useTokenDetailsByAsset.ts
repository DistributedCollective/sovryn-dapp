import { useEffect, useState } from 'react';

import { AssetDetailsData, getAssetData } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../config/chains';

import { useIsMounted } from './useIsMounted';

export const useTokenDetailsByAsset = (
  asset?: string,
  chainId = RSK_CHAIN_ID,
): AssetDetailsData | undefined => {
  const isMounted = useIsMounted();
  const [token, setToken] = useState<AssetDetailsData | undefined>();

  useEffect(() => {
    if (asset && isMounted()) {
      getAssetData(asset!, chainId)
        .then(setToken)
        .catch(e => {
          console.error('token not found?', asset, chainId, e);
        });
    }
  }, [asset, chainId, isMounted]);

  return token;
};
