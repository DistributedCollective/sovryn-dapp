import React, {
  useContext,
  createContext,
  useState,
  useCallback,
  FC,
  PropsWithChildren,
} from 'react';

import { produce } from 'immer';

import { VestingContractTableRecord } from '../Vesting.types';

export type State = {
  count: number;
  item?: VestingContractTableRecord;
};

type Update = (state: State) => void;

type Actions = {
  update: (handler: Update) => void;
};

const defaultValue: State & Actions = {
  count: 0,
  item: undefined,
  update: () => {},
};

const VestingContext = createContext<State & Actions>(defaultValue);

export function useVestingContext() {
  const context = useContext(VestingContext);
  if (context === undefined) {
    throw new Error(
      'useVestingContext must be used within a VestingContextProvider',
    );
  }
  return context;
}

export const VestingContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<State>({
    count: 0,
    item: undefined,
  });

  const handleOnChange = useCallback(
    (handler: (value: State) => void) => setState(produce(handler)),
    [],
  );

  return (
    <VestingContext.Provider value={{ ...state, update: handleOnChange }}>
      {children}
    </VestingContext.Provider>
  );
};
