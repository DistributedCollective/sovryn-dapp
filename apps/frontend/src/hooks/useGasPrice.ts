import { useEffect, useState } from 'react';

import { formatUnits } from 'ethers/lib/utils';

import { getProvider } from '@sovryn/ethers-provider';
import { ChainId } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../config/chains';

export const useGasPrice = (chainId: ChainId = defaultChainId) => {
  const [gasPrice, setGasPrice] = useState<Decimal>(Decimal.ZERO);

  useEffect(() => {
    const getGasPrice = async () => {
      try {
        const gas = formatUnits(
          await getProvider(chainId).getGasPrice(),
          'gwei',
        );

        setGasPrice(Decimal.from(gas));
      } catch (error) {}
    };
    getGasPrice();
  }, [chainId]);

  return gasPrice;
};
