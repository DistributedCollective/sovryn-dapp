import { of, startWith, take } from 'rxjs';
import { ChainIds } from '../src';
import { state } from '../src/store';
import { addChains, resetStore, updateChain } from '../src/store/actions';

const chains = [
  {
    id: ChainIds.RSK_MAINNET,
    rpcUrl: 'https://public-node.rsk.co',
    label: 'RSK Mainnet',
  },
  {
    id: ChainIds.RSK_TESTNET,
    rpcUrl: 'https://public-node.testnet.rsk.co',
    label: 'RSK Testnet',
  },
];

describe('actions', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should add chains', () => {
    addChains(chains);
    expect(state.get().chains).toEqual(chains);
  });

  it('should update existing chain', () => {
    addChains(chains);
    const chain = chains[0];
    const updatedChain = { ...chain, rpcUrl: 'https://updated-url.com' };
    updateChain(updatedChain);
    expect(state.get().chains[0]).toEqual(updatedChain);
  });

  it('should add new chain', () => {
    addChains(chains);
    const newChain = {
      id: ChainIds.MAINNET,
      label: 'Mainnet',
      rpcUrl: 'https://updated-url.com',
    };
    updateChain(newChain);
    expect(state.get().chains).toEqual([...chains, newChain]);
  });

  it('should reset store', () => {
    addChains(chains);
    resetStore();
    expect(state.get().chains).toEqual([]);
  });

  it('should be able to subscribe to observable with selector', done => {
    addChains(chains);
    state
      .select('chains')
      .pipe(startWith(state.get().chains), take(1))
      .subscribe(value => {
        expect(value).toEqual(chains);
        done();
      });
  });

  it('should throw error when subscribing to non existing key', () => {
    expect(() => state.select('nonExistingKey')).toThrowError(
      'key: nonExistingKey does not exist on this store',
    );
  });
});
