import { keepPreviousData, useQuery } from '@tanstack/react-query';

import React, { createContext, useContext, ReactNode } from 'react';

import { DATA_REFRESH_INTERVAL } from '../constants/general';
import { useCurrentChain } from '../hooks/useChainStore';
import { loadIndexer } from '../lib/indexer';
import { decimalic } from '../utils/math';

interface TokenPricesContextType {
  prices: Record<string, string>;
  loading: boolean;
}

interface TokenPricesProviderProps {
  children: ReactNode;
}

export type TokenData = {
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  address: string;
  usdPrice: string;
};

const TokenPricesContext = createContext<TokenPricesContextType | undefined>(
  undefined,
);

export const TokenPricesProvider: React.FC<TokenPricesProviderProps> = ({
  children,
}) => {
  const currentChainId = useCurrentChain();

  const { data, isFetching } = useQuery({
    queryKey: ['tokenPrices', currentChainId],
    initialData: {},
    placeholderData: keepPreviousData,
    refetchInterval: DATA_REFRESH_INTERVAL,
    queryFn: async () => {
      const data = await loadIndexer(currentChainId).tokens.list();

      if (data) {
        const prices = data.reduce(
          (acc: Record<string, string>, tokenData: TokenData) => {
            acc[tokenData.address.toLowerCase()] = decimalic(
              tokenData.usdPrice,
            ).toString();
            return acc;
          },
          {},
        );
        return prices;
      }
      throw new Error('No token prices data');
    },
  });

  return (
    <TokenPricesContext.Provider value={{ prices: data, loading: isFetching }}>
      {children}
    </TokenPricesContext.Provider>
  );
};

export const useTokenPrices = (): TokenPricesContextType => {
  const context = useContext(TokenPricesContext);
  if (!context) {
    throw new Error('useTokenPrices must be used within a TokenPricesProvider');
  }
  return context;
};
