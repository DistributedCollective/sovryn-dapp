import { ChainIds } from '../src/chains';
import { getProvider } from '../src/provider';
import { resetStore } from '../src/store/actions';
import { Chain } from '../src/types';
import init from '../src/index';

const initChains: Chain[] = [
  {
    id: ChainIds.RSK_MAINNET,
    rpcUrl: 'https://public-node.rsk.co',
    label: 'RSK Mainnet',
  },
  {
    id: ChainIds.RSK_TESTNET,
    rpcUrl: 'https://public-node.testnet.rsk.co',
    providerConnectionInfo: { url: 'https://public-node.testnet.rsk.co' },
    label: 'RSK Testnet',
  },
];

describe('tests provider', () => {
  beforeEach(() => {
    resetStore();
  });

  it('non-registered provider with no config returns null', () => {
    expect(getProvider()).toBe(null);
  });

  it('non-registered provider returns null', () => {
    expect(getProvider(ChainIds.RSK_MAINNET)).toBe(null);
  });

  it('custom provider returns current block number', async () => {
    const provider = getProvider(initChains[0]);
    const blockNumber = await provider.getBlockNumber();
    expect(blockNumber).toBeGreaterThan(0);
  });

  it('registered global chains returns block number', async () => {
    init(initChains);

    const blockNumber1 = await getProvider(
      ChainIds.RSK_MAINNET,
    ).getBlockNumber();
    expect(blockNumber1).toBeGreaterThan(0);
  });

  it('use ethers ConnectionInfo as provider config', async () => {
    init(initChains);

    const blockNumber1 = await getProvider(
      ChainIds.RSK_TESTNET,
    ).getBlockNumber();
    expect(blockNumber1).toBeGreaterThan(0);
  });
});
