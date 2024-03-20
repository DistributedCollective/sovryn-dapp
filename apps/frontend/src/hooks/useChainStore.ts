import { create } from 'zustand';
import { ChainId } from '@sovryn/ethers-provider';
import { produce } from 'immer';
import { defaultChainId } from '../config/chains';

type ChainStore = {
  currentChainId: ChainId;
  setCurrentChainId: (chainId: ChainId) => void;
};

export const useChainStore = create<ChainStore>(set => ({
  currentChainId: defaultChainId,
  setCurrentChainId: (chainId: ChainId = defaultChainId) =>
    set(
      produce(state => {
        state.currentChainId = chainId;
        console.log('chain to be changed:', state.currentChainId);
      }),
    ),
}));

export const useCurrentChain = (): ChainId =>
  useChainStore(state => state.currentChainId);

export const getCurrentChain = (): ChainId =>
  useChainStore.getState().currentChainId;
export const setCurrentChain = (chainId: ChainId = defaultChainId) =>
  useChainStore.getState().setCurrentChainId(chainId);
