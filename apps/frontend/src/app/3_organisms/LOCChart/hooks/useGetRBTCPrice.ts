import { EthersLiquity, ReadableEthersLiquity } from '@sovryn-zero/lib-ethers';

import { useEffect, useState } from 'react';

import { getProvider } from '@sovryn/ethers-provider';

import { getRskChainId } from '../../../../utils/chain';

export const useGetRBTCPrice = () => {
  const [price, setPrice] = useState('0');

  useEffect(() => {
    const getPrice = async () => {
      const provider = await ReadableEthersLiquity.connect(
        getProvider(getRskChainId()),
        { useStore: 'blockPolled' },
      );
      const liquity = new EthersLiquity(provider);
      const price = await liquity.getPrice();
      return price.toString();
    };
    getPrice().then(setPrice);
  }, [price]);

  return { price };
};
