import React from 'react';

import {
  SendFlowContext,
  defaultValue,
  SendFlowContextStateType,
} from '../contexts/sendflow';

export type SendFlowContextProviderProps = {
  children: React.ReactNode;
};

export const SendFlowContextProvider: React.FC<
  SendFlowContextProviderProps
> = ({ children }) => {
  const [state, setState] =
    React.useState<SendFlowContextStateType>(defaultValue);
  const value = React.useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state],
  );

  return (
    <SendFlowContext.Provider value={value}>
      {children}
    </SendFlowContext.Provider>
  );
};
