import { create } from 'zustand';

type RedemptionDialogStore = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

export const useRedemptionDialog = create<RedemptionDialogStore>()(set => ({
  isOpen: false,
  setOpen: value => set({ isOpen: value }),
}));
