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
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.text();
      console.log('error: ', error);
      return;
    }

    const { deposit_address: depositAddress } = await response.json();
    console.log('depositAddress', depositAddress);
    set(prevState => {
      return {
        ...prevState,
        depositAddress,
      };
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
