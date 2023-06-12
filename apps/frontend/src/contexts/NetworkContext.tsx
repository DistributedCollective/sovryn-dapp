import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ChainIds } from '@sovryn/ethers-provider';

import { defaultChainId } from '../config/chains';

interface NotificationContextInterface {
  chainId: ChainIds;
  requireChain: (chainId: ChainIds) => void;
}

const NetworkContext = createContext<NotificationContextInterface>({
  chainId: defaultChainId as ChainIds,
} as NotificationContextInterface);

export const useNetworkContext = () =>
  useContext(NetworkContext) as NotificationContextInterface;

interface NotificationProviderProps {
  children?: React.ReactNode;
}

export const NetworkContextProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [chainId, setChainId] = useState<ChainIds>(defaultChainId as ChainIds);
  const requireChain = useCallback((chainId: ChainIds) => {
    setChainId(chainId);
  }, []);

  const value = useMemo(
    () => ({
      chainId,
      requireChain,
    }),
    [chainId, requireChain],
  );

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};
