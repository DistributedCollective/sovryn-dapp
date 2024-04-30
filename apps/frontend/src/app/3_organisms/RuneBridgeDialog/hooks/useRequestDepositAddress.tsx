import React from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { runeBridgeApiClient } from '../api';
import { RequestOpts } from '../api/RuneBridgeClient';
import { useRuneContext } from '../contexts/rune';

export const useRequestDepositAddress = () => {
  const { account } = useAccount();
  const { set } = useRuneContext();

  return React.useCallback(async () => {
    const url = '/runes/deposit-addresses/';
    const data = { evm_address: account };
    const requestOps: RequestOpts = {
      method: 'POST',
      data,
    };
    return await runeBridgeApiClient.request(url, requestOps).then(response => {
      const { deposit_address: depositAddress } = response;
      set(prevState => {
        return {
          ...prevState,
          depositAddress,
        };
      });
      return response;
    });
  }, [account, set]);
};
