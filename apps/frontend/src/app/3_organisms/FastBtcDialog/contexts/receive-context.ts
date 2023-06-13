import { createContext, Dispatch, SetStateAction } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { Nullable } from '../../../../types/global';

export enum ReceiveStep {
  MAIN,
  SELECT_ASSET,
  BITCOIN_FLOW,
  AMOUNT,
  DETAILS,
}

export enum OriginNetwork {
  BITCOIN,
  ETHEREUM,
  BINANCE_SMART_CHAIN,
}

export type ReceiveContextStateType = {
  step: ReceiveStep;
  originNetwork: Nullable<OriginNetwork>;
  asset: SupportedTokens;
  amount: string;
};

export type ReceiveContextFunctionsType = {
  set: Dispatch<SetStateAction<ReceiveContextStateType>>;
};

export type ReceiveContextType = ReceiveContextStateType &
  ReceiveContextFunctionsType;

export const defaultValue: ReceiveContextType = {
  step: ReceiveStep.MAIN,
  originNetwork: null,
  asset: SupportedTokens.dllr,
  amount: '0',
  set: () => {
    throw new Error('set() has not been defined.');
  },
};

export const ReceiveContext = createContext<ReceiveContextType>(defaultValue);
