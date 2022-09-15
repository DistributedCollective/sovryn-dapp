import { ethers } from 'ethers';

import init from '.';
import { chains } from './__utils__/test-utils';
import { ChainIds } from './chains';
import { getProvider } from './provider';
import { resetStore } from './store/actions';

describe('#getProvider', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should return null when chains not registered and using provider by chain id', () => {
    const provider = getProvider(ChainIds.RSK_MAINNET);
    expect(provider).toBeNull();
  });

  it('should return ethers provider', () => {
    const provider = getProvider(chains[0]);
    expect(provider).toBeInstanceOf(ethers.providers.Provider);
  });

  it('should return ethers provider after registering chains', () => {
    init(chains);
    const provider = getProvider();
    expect(provider).toBeInstanceOf(ethers.providers.Provider);
  });

  it('should return ethers provider by id after registering chains', () => {
    init(chains);
    const provider = getProvider(ChainIds.RSK_MAINNET);
    expect(provider).toBeInstanceOf(ethers.providers.Provider);
  });

  it('should return null after reseting store', () => {
    init(chains);
    resetStore();
    const provider = getProvider(ChainIds.RSK_MAINNET);
    expect(provider).toBeNull();
  });

  it('should return network chain using rpc url', async () => {
    const provider = getProvider(chains[0]);
    const result = await provider.getNetwork();
    expect(result.chainId).toEqual(Number(chains[0].id));
  });

  it('should return network chain using providerConnectionInfo', async () => {
    const provider = getProvider(chains[1]);
    const result = await provider.getNetwork();
    expect(result.chainId).toEqual(Number(chains[1].id));
  });
});
