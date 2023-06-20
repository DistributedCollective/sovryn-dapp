import { createContext, Dispatch, SetStateAction } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { Nullable } from '../../../../types/global';
import { OriginNetwork } from '../types';

export enum SendStep {
  BITCOIN_FLOW,
  MAIN,
  NETWORK,
  ADDRESS,
  SENDER_ASSET,
  RECIPIENT_ASSET,
  AMOUNT,
  DETAILS,
}

export type SendContextStateType = {
  step: SendStep;
  originNetwork: Nullable<OriginNetwork>;
  address: string;
  senderAsset: Nullable<SupportedTokens>;
  recipientAsset: Nullable<SupportedTokens>;
  amount: string;
};

export type SendContextFunctionsType = {
  set: Dispatch<SetStateAction<SendContextStateType>>;
};

export type SendContextType = SendContextStateType & SendContextFunctionsType;

export const defaultValue: SendContextType = {
  step: SendStep.MAIN,
  originNetwork: null,
  address: '',
  senderAsset: null,
  recipientAsset: null,
  amount: '0',
  set: () => {
    throw new Error('set() has not been defined.');
  },
};

export const SendContext = createContext<SendContextType>(defaultValue);
