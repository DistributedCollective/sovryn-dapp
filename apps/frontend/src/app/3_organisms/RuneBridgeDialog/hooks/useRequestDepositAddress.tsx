import React from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { RequestOpts } from '../api/RuneBridgeClient';
import { depositAddressPath } from '../constants';
import { useRuneContext } from '../contexts/rune';
import { useRuneBridgeApiClient } from './useRuneBridgeApiClient';

export const useRequestDepositAddress = () => {
  const { account } = useAccount();
  const { set } = useRuneContext();
  const runeBridgeApiClient = useRuneBridgeApiClient();
  return React.useCallback(async () => {
    const data = { evm_address: account };
    const requestOps: RequestOpts = {
      method: 'POST',
      data,
    };
    return await runeBridgeApiClient
      .request(depositAddressPath, requestOps)
      .then(response => {
        const { deposit_address: depositAddress } = response;
        set(prevState => {
          return {
            ...prevState,
            depositAddress,
          };
        });
        return response;
      });
  }, [account, runeBridgeApiClient, set]);
};
