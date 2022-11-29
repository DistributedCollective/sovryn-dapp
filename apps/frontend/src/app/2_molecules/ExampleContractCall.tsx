import { EthersLiquity, ReadableEthersLiquity } from '@sovryn-zero/lib-ethers';

import React, { useEffect } from 'react';

import { ChainIds, getProvider } from '@sovryn/ethers-provider';

import { useWalletConnect } from '../../hooks';

export const ExampleContractCall = () => {
  const { wallets } = useWalletConnect();
  const [balance, setBalance] = React.useState('');

  useEffect(() => {
    const getBalance = async () => {
      const liquity = new EthersLiquity(
        await ReadableEthersLiquity.connect(getProvider(ChainIds.RSK_TESTNET)),
      );
      const balance = (
        await liquity.getZUSDBalance(
          wallets[0]?.accounts[0]?.address.toLowerCase(),
        )
      ).toString();
      return balance;
    };

    if (wallets.length) {
      getBalance().then(balance => setBalance(balance));
    }
  }, [wallets]);

  return <div>ZUSD balance: {balance}</div>;
};
