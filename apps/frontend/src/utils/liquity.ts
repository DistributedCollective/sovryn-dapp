import {
  BlockPolledLiquityStore,
  EthersLiquity,
  ReadableEthersLiquity,
  ReadableEthersLiquityWithStore,
} from '@sovryn-zero/lib-ethers';

import { getProvider } from '@sovryn/ethers-provider';

import { getRskChainId } from './chain';

type LiquityResponse = {
  liquity: EthersLiquity;
  provider: ReadableEthersLiquityWithStore<BlockPolledLiquityStore>;
};

let cachedLiquity: LiquityResponse;

export const loadLiquity = async (): Promise<LiquityResponse> => {
  if (!cachedLiquity) {
    const provider = await ReadableEthersLiquity.connect(
      getProvider(getRskChainId()),
      { useStore: 'blockPolled' },
    );
    const liquity = new EthersLiquity(provider);

    cachedLiquity = {
      liquity,
      provider,
    };
  }

  return cachedLiquity;
};
