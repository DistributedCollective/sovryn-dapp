import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../config/chains';

import { useAccount } from '../hooks/useAccount';

type CrocContextValue = {
  croc?: CrocEnv;
};

const defaultContextValue: CrocContextValue = {
  croc: undefined,
};

const CrocContext = createContext<CrocContextValue>(defaultContextValue);

export const useCrocContext = () => useContext(CrocContext) as CrocContextValue;

export const CrocContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { account, signer } = useAccount();
  const [croc, setCroc] = useState(defaultContextValue.croc);

  useEffect(() => {
    if (!croc && account) {
      setCroc(new CrocEnv(getProvider(BOB_CHAIN_ID), signer));
    }
  }, [croc, signer, account]);

  return (
    <CrocContext.Provider value={{ croc }}>{children}</CrocContext.Provider>
  );
};
