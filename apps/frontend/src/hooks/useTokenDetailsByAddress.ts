import { useEffect, useState } from 'react';

import { getTokenDetailsByAddress, TokenDetailsData } from '@sovryn/contracts';

export const useTokenDetailsByAddress = (address?: string) => {
  const [token, setToken] = useState<TokenDetailsData | undefined>();

  useEffect(() => {
    const updateToken = () => {
      getTokenDetailsByAddress(address!)
        .then(setToken)
        .catch(e => {
          console.error('token not found?', e);
        });
    };

    if (address) {
      updateToken();
    }
  }, [address]);

  return token;
};
