import { EthersLiquity, ReadableEthersLiquity } from '@sovryn-zero/lib-ethers';

import { getProvider } from '@sovryn/ethers-provider';

import { getRskChainId } from '../../../utils/chain';

export const zeroPageLoader = async () => {
  const provider = await ReadableEthersLiquity.connect(
    getProvider(getRskChainId()),
    { useStore: 'blockPolled' },
  );
  const liquity = new EthersLiquity(provider);
  return { liquity, provider };
};
