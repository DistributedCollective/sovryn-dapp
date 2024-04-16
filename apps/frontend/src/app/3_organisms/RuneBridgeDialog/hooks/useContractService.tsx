import React from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { runeBridgeApiClient } from '../api';
import { RequestOpts } from '../api/RuneBridgeClient';
import { Contract } from '../contexts/contract';

export const useContractService = () => {
  const { account } = useAccount();
  const {
    set,
    depositAddress,
    runeBridgeContract,
    tokenBalances,
    requestTokenBalances,
  } = React.useContext(Contract);
  const requestDepositAddress = React.useCallback(async () => {
    const url = '/runes/deposit-addresses/';
    const data = { evm_address: account };
    const requestOps: RequestOpts = {
      method: 'POST',
      data,
    };
    return await runeBridgeApiClient
      .request(url, requestOps)
      .then(response => {
        const { deposit_address: depositAddress } = response;
        set(prevState => {
          return {
            ...prevState,
            depositAddress,
          };
        });
        return response;
      })
      .catch(error => {
        throw new Error(error);
      });
  }, [account, set]);
  return {
    requestDepositAddress,
    requestTokenBalances,
    depositAddress,
    runeBridgeContract,
    tokenBalances,
    set,
  };
};
