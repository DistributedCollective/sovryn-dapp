import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';

import axios from 'axios';

import { DATA_REFRESH_INTERVAL } from '../constants/general';
import { useCurrentChain } from '../hooks/useChainStore';
import { getSdexUri } from '../utils/indexer';
import { decimalic } from '../utils/math';

interface TokenPricesContextType {
  prices: Record<string, string>;
  loading: boolean;
}

interface TokenPricesProviderProps {
  children: ReactNode;
}

type TokenDataProps = {
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
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const currentChainId = useCurrentChain();

  const fetchTokenPrices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${getSdexUri(currentChainId)}/tokens`);
      const { data } = response.data;

      if (data) {
        const prices = data.reduce(
          (acc: Record<string, string>, tokenData: TokenDataProps) => {
            acc[tokenData.address.toLowerCase()] = decimalic(
              tokenData.usdPrice,
            ).toString();
            return acc;
          },
          {},
        );
        setPrices(prices);
      } else {
        setPrices({});
      }
    } catch (error) {
      console.error('Failed to fetch token prices:', error);
      setPrices({});
    } finally {
      setLoading(false);
    }
  }, [currentChainId]);

  useEffect(() => {
    fetchTokenPrices();
    const intervalId = setInterval(fetchTokenPrices, DATA_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchTokenPrices]);

  return (
    <TokenPricesContext.Provider value={{ prices, loading }}>
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
