import React from 'react';

import {
  ReceiveFlowContext,
  defaultValue,
  ReceiveFlowContextStateType,
} from '../contexts/receiveflow';

export type ReceiveFlowContextProviderProps = {
  children: React.ReactNode;
};

export const ReceiveFlowContextProvider: React.FC<
  ReceiveFlowContextProviderProps
> = ({ children }) => {
  const [state, setState] =
    React.useState<ReceiveFlowContextStateType>(defaultValue);
  const value = React.useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state],
  );

  return (
    <ReceiveFlowContext.Provider value={value}>
      {children}
    </ReceiveFlowContext.Provider>
  );
};
