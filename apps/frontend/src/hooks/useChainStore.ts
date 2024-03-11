import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { ChainId } from '@sovryn/ethers-provider';

import { DEFAULT_CHAIN_ID } from '../config/chains';

import { onboard } from '../lib/connector';

type ChainStore = {
  currentChainId: ChainId;
  setCurrentChainId: (chainId: ChainId) => void;
};

export const useChainStore = create<ChainStore>()(
  persist(
    set => ({
      currentChainId: DEFAULT_CHAIN_ID,
      setCurrentChainId: async (chainId: ChainId = DEFAULT_CHAIN_ID) => {
        // todo: should disconnect wallets which does not support network changes
        await onboard.setChain({ chainId });
        set({ currentChainId: chainId });
      },
    }),
    {
      name: 'chain-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useCurrentChain = (): ChainId =>
  useChainStore(state => state.currentChainId);

export const getCurrentChain = (): ChainId =>
  useChainStore.getState().currentChainId;
export const setCurrentChain = (chainId: ChainId = DEFAULT_CHAIN_ID) =>
  useChainStore.getState().setCurrentChainId(chainId);
