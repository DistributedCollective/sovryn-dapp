import { useEffect, useState } from 'react';

import { formatUnits } from 'ethers/lib/utils';

import { getProvider } from '@sovryn/ethers-provider';
import { ChainId } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../config/chains';

import { decimalic } from '../utils/math';

export const useGasPrice = (chainId: ChainId = RSK_CHAIN_ID) => {
  const [gasPrice, setGasPrice] = useState(Decimal.ZERO);

  useEffect(() => {
    const getGasPrice = async () => {
      try {
        const gas = formatUnits(
          await getProvider(chainId).getGasPrice(),
          'gwei',
        );

        setGasPrice(decimalic(gas));
      } catch (error) {}
    };
    getGasPrice();
  }, [chainId]);

  return gasPrice;
};
