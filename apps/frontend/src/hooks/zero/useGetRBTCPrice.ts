import { EthersLiquity, ReadableEthersLiquity } from '@sovryn-zero/lib-ethers';
import { getProvider } from '@sovryn/ethers-provider';

import { getRskChainId } from '../../utils/chain';
import { useCacheCall } from '../useCacheCall';
import { getCurrentChain } from '../useChainStore';

export const useGetRBTCPrice = () => {
  const { value: price, loading } = useCacheCall(
    'rbtc/price',
    getCurrentChain(),
    async () => {
      const provider = await ReadableEthersLiquity.connect(
        getProvider(getRskChainId()),
        { useStore: 'blockPolled' },
      );
      const liquity = new EthersLiquity(provider);
      const price = await liquity.getPrice();
      return price.toString();
    },
  );

  return { price, loading };
};
