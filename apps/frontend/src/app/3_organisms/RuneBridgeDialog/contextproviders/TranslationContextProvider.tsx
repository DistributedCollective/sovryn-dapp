import React from 'react';

import { ChainIds } from '@sovryn/ethers-provider';

import { useCurrentChain } from '../../../../hooks/useChainStore';
import { isBobChain } from '../../../../utils/chain';
import {
  TranslationContext,
  TranslationContextStateType,
  defaultValue,
} from '../contexts/translation';

export type RuneContextProviderProps = {
  children: React.ReactNode;
};

export const TranslationContextProvider: React.FC<RuneContextProviderProps> = ({
  children,
}) => {
  const [state, setState] =
    React.useState<TranslationContextStateType>(defaultValue);
  const chainId = useCurrentChain();
  React.useEffect(() => {
    if (
      ![
        ChainIds.RSK_MAINNET,
        ChainIds.RSK_TESTNET,
        ChainIds.BOB_MAINNET,
        ChainIds.BOB_TESTNET,
      ].includes(chainId as ChainIds)
    )
      return;
    const service = isBobChain(chainId) ? 'Bob' : 'Rootstock';
    const coinAbbreviation = isBobChain(chainId) ? 'ETH' : 'BTC';
    const chainName = service;
    setState(prevState => {
      return {
        ...prevState,
        service,
        coinAbbreviation,
        chainName,
      };
    });
  }, [chainId]);
  const value = React.useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state],
  );
  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
