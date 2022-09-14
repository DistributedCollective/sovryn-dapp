import init, { Chain, ChainIds } from '../src';

const chains: Chain[] = [
  {
    id: ChainIds.RSK_MAINNET,
    rpcUrl: 'https://public-node.rsk.co',
    label: 'RSK Mainnet',
  },
];

describe('init', () => {
  it('should return chains after initiliation', () => {
    const api = init(chains);
    expect(api.chains()).toEqual(chains);
  });
});
