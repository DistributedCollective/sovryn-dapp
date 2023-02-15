import { useEffect, useState } from 'react';

import { formatUnits } from 'ethers/lib/utils';

import { getProvider } from '@sovryn/ethers-provider';
import { ChainId } from '@sovryn/ethers-provider';

import { defaultChainId } from '../config/chains';

export const useGasPrice = (chainId: ChainId = defaultChainId) => {
  const [gasPrice, setGasPrice] = useState('');

  useEffect(() => {
    const getGasPrice = async () => {
      try {
        const gas = formatUnits(
          await getProvider(chainId).getGasPrice(),
          'gwei',
        );

        setGasPrice(gas.toString());
      } catch (error) {}
    };
    getGasPrice();
  }, [chainId]);

  return gasPrice;
};
