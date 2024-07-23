import React, { FC } from 'react';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { CrocContextProvider } from '../../../contexts/CrocContext';
import { TokenPricesProvider } from '../../../contexts/TokenPricesContext';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { AmbientMarketMaking } from './components/AmbientMarketMaking/AmbientMarketMaking';
import { MarketMaking } from './components/MarketMaking/MarketMaking';

const MarketMakingPage: FC = () => {
  const currentChainId = useCurrentChain();

  return (
    <TokenPricesProvider>
      {currentChainId !== RSK_CHAIN_ID ? (
        <CrocContextProvider>
          <AmbientMarketMaking />
        </CrocContextProvider>
      ) : (
        <MarketMaking />
      )}
    </TokenPricesProvider>
  );
};

export default MarketMakingPage;
