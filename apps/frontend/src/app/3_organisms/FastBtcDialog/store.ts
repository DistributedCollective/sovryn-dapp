import { create } from 'zustand';

export enum Network {
  none,
  bitcoin,
  lightning,
}

interface FastBtcDialogStore {
  network: Network;
  set: (network: Network) => void;
  reset: () => void;
}

export const useFastBtcDialogStore = create<FastBtcDialogStore>(set => ({
  network: Network.none,
  set: network => set({ network }),
  reset: () => set({ network: Network.none }),
}));
