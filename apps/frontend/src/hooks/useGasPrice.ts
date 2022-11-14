import { useEffect, useState } from 'react';

import { formatUnits } from 'ethers/lib/utils';

import { getProvider } from '@sovryn/ethers-provider';

import { defaultChainId } from '../config/chains';

export const useGasPrice = () => {
  const [gasPrice, setGasPrice] = useState('');

  useEffect(() => {
    const getGasPrice = async () => {
      try {
        const gas = formatUnits(
          await getProvider(defaultChainId).getGasPrice(),
          'gwei',
        );

        setGasPrice(gas.toString());
      } catch (error) {}
    };
    getGasPrice();
  }, []);

  return gasPrice;
};
