import React, { useCallback } from 'react';

import { runeBridgeApiClient } from '../api';
import { RequestOpts } from '../api/RuneBridgeClient';
import { depositsPath, lastScannedBtcBlockPath } from '../constants';
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
  const requestLastScannedBlock = useCallback(async () => {
    const reqOptions: RequestOpts = {
      method: 'GET',
    };
    return await runeBridgeApiClient.request(
      lastScannedBtcBlockPath,
      reqOptions,
    );
  }, []);
  const getRuneDepositStatus = useCallback(
    async (userEvmAddress: string, lastScannedBlockHash: string) => {
      const path = `${depositsPath}/${userEvmAddress}/${lastScannedBlockHash}`;
      const reqOptions: RequestOpts = {
        method: 'GET',
      };
      return await runeBridgeApiClient.request(path, reqOptions);
    },
    [],
  );
  const value = React.useMemo(
    () => ({
      ...state,
      set: setState,
      requestLastScannedBlock,
      getRuneDepositStatus,
    }),
    [getRuneDepositStatus, requestLastScannedBlock, state],
  );

  return (
    <ReceiveFlowContext.Provider value={value}>
      {children}
    </ReceiveFlowContext.Provider>
  );
};
