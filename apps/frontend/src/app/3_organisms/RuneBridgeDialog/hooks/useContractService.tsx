import React from 'react';

import { useAccount } from '../../../../hooks/useAccount';
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
    const url = 'http://127.0.0.1:8181/api/v1/runes/deposit-addresses/';
    const data = { evm_address: account };
    return await fetch(url, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(async response => {
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
        const result = await response.json();
        const { deposit_address: depositAddress } = result;
        set(prevState => {
          return {
            ...prevState,
            depositAddress,
          };
        });
        return result;
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
