import { take } from 'rxjs';

import { state, dispatch } from '.';
import { chains } from '../__utils__/test-utils';
import { ChainIds } from '../chains';
import { addChains, resetStore, updateChain } from './actions';

describe('actions and state', () => {
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
    state
      .select()
      .pipe(take(1))
      .subscribe(value => {
        expect(value).toEqual({ chains: chains });
        done();
      });
    addChains(chains);
  });

  it('should be able to subscribe to observable with named selector', done => {
    state
      .select('chains')
      .pipe(take(1))
      .subscribe(value => {
        expect(value).toEqual(chains);
        done();
      });
    addChains(chains);
  });

  it('should throw error when subscribing to non existing key', () => {
    // @ts-expect-error - key does not exist and we know it.
    expect(() => state.select('nonExistingKey')).toThrowError(
      'key: nonExistingKey does not exist on this store',
    );
  });

  it('should throw error when dispatching non existing action', () => {
    expect(() =>
      dispatch({
        // @ts-expect-error - key does not exist and we know it.
        type: 'nonExistingType',
        payload: {},
      }),
    ).toThrowError('Unknown type: nonExistingType in appStore reducer');
  });
});
