import React from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { ContractContext } from '../contexts/contract_context';

export const useContractServices = () => {
  const { account } = useAccount();
  const { set, depositAddress, runeBridgeContract, tokenBalances } =
    React.useContext(ContractContext);
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
  const requestTokenBalances = React.useCallback(async () => {}, []);
  const refreshTokenBalances = React.useCallback(async () => {
    console.log('refreshTokenBalances');
  }, []);
  return {
    requestDepositAddress,
    requestTokenBalances,
    refreshTokenBalances,
    depositAddress,
    runeBridgeContract,
    tokenBalances,
    set,
  };
};
