import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { CrocEnv } from '@sovryn/sdex';
import { getProvider } from '@sovryn/ethers-provider';

import { useAccount } from '../hooks/useAccount';
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
  const { account, signer } = useAccount();
  const [croc, setCroc] = useState(defaultContextValue.croc);

  useEffect(() => {
    if (!croc && account) {
      setCroc(new CrocEnv(getProvider(chainId), signer));
    }
  }, [croc, signer, account, chainId]);

  return (
    <CrocContext.Provider value={{ croc }}>{children}</CrocContext.Provider>
  );
};
