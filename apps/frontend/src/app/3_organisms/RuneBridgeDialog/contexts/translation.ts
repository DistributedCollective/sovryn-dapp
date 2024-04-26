import React, { Dispatch, SetStateAction } from 'react';

import { noop } from '@sovryn/ui';

export type TranslationContextStateType = {
  service: string;
  cryptoDenomination: string; // Satoshi
  coinAbbreviation: string; // BTC
  chainName: string;
};

export type TranslationContextFunctionsType = {
  set: Dispatch<SetStateAction<TranslationContextStateType>>;
};
export type TranslationContextType = TranslationContextStateType &
  TranslationContextFunctionsType;

export const defaultValue: TranslationContextType = {
  service: 'Rootstock',
  cryptoDenomination: 'Satoshi',
  coinAbbreviation: 'BTC',
  chainName: 'Rootstock',
  set: noop,
};

export const TranslationContext = React.createContext(defaultValue);

export const useTranslationContext = () => {
  return React.useContext(TranslationContext) as TranslationContextType;
};
