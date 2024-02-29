import { useEffect, useState } from 'react';

import {
  getTokenDetails,
  SupportedTokens,
  TokenDetailsData,
} from '@sovryn/contracts';

import { defaultChainId } from '../config/chains';

export const useTokenDetailsByAsset = (asset?: SupportedTokens) => {
  const [token, setToken] = useState<TokenDetailsData | undefined>();

  useEffect(() => {
    const getTokenDetail = () => {
      getTokenDetails(asset!, defaultChainId)
        .then(setToken)
        .catch(e => {
          console.error('token not found?', e);
        });
    };

    if (asset) {
      getTokenDetail();
    }
  }, [asset]);

  return token;
};
