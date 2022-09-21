import { providers } from 'ethers';
import { startWith, take } from 'rxjs';

import init from '.';
import { chains } from './__utils__/test-utils';
import { resetStore } from './store/actions';

describe('#init', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should return list of chains', () => {
    const config = init(chains);
    expect(config.chains()).toEqual(chains);
  });

  it('should return ethers provider', () => {
    const config = init(chains);
    const provider = config.getProvider();
    expect(provider).toBeInstanceOf(providers.Provider);
  });

  it('should allow to add new chains', () => {
    const config = init(chains);
    const newChain = {
      id: '123',
      label: 'New Chain',
      rpcUrl: 'http://localhost:8545',
    };
    config.addChains([newChain]);
    expect(config.chains()).toEqual([...chains, newChain]);
  });

  it('should allow to update existing chain', () => {
    const config = init(chains);
    const updatedChain = {
      ...chains[0],
      label: 'Updated Chain',
    };
    config.updateChain(updatedChain);
    expect(config.chains()).toEqual([updatedChain, chains[1]]);
  });

  it('should be able to subscribe to observable (with seed data)', done => {
    const config = init(chains);
    config.observe
      .pipe(startWith(config.chains()), take(1))
      .subscribe(chains => {
        expect(chains).toEqual(chains);
        done();
      });
  });

  it('should be able to subscribe to observable (only new pushes)', done => {
    const config = init(chains);
    config.observe.pipe(take(1)).subscribe(chains => {
      expect(chains).toEqual(chains);
      done();
    });
    config.addChains([]);
  });
});
