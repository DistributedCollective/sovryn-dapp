import { EthersLiquity, ReadableEthersLiquity } from '@sovryn-zero/lib-ethers';

import { getProvider } from '@sovryn/ethers-provider';

import { getRskChainId } from '../../../../utils/chain';

type ZeroProvider = {
  provider: ReadableEthersLiquity;
  ethers: EthersLiquity;
};

let _provider: ZeroProvider;

export const getZeroProvider = async () => {
  if (!_provider) {
    const provider = await ReadableEthersLiquity.connect(
      getProvider(getRskChainId()),
      { useStore: 'blockPolled' },
    );
    const ethers = new EthersLiquity(provider);
    _provider = {
      provider,
      ethers,
    };
    return _provider;
  }
  return _provider;
};
