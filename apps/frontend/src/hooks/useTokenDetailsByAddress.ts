import { useEffect, useState } from 'react';

import { getTokenDetailsByAddress, TokenDetailsData } from '@sovryn/contracts';

export const useTokenDetailsByAddress = (address?: string) => {
  const [token, setToken] = useState<TokenDetailsData | undefined>();

  useEffect(() => {
    const getTokenDetails = () => {
      getTokenDetailsByAddress(address!)
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
