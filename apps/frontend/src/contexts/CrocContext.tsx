import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getProvider } from '@sovryn/ethers-provider';
import { CrocEnv } from '@sovryn/sdex';

import { useCurrentChain } from '../hooks/useChainStore';

type CrocContextValue = {
  croc?: CrocEnv;
};

const defaultContextValue: CrocContextValue = {
  croc: undefined,
};

const CrocContext = createContext<CrocContextValue>(defaultContextValue);

export const useCrocContext = () => useContext(CrocContext) as CrocContextValue;

export const CrocContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const chainId = useCurrentChain();
  const [croc, setCroc] = useState(defaultContextValue.croc);

  useEffect(() => {
    if (!croc) {
      setCroc(new CrocEnv(getProvider(chainId)));
    }
  }, [croc, chainId]);

  return (
    <CrocContext.Provider value={{ croc }}>{children}</CrocContext.Provider>
  );
};
