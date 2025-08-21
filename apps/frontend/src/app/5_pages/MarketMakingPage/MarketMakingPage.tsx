import React, { FC } from 'react';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { CrocContextProvider } from '../../../contexts/CrocContext';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { AmbientMarketMaking } from './components/AmbientMarketMaking/AmbientMarketMaking';
import { MarketMaking } from './components/MarketMaking/MarketMaking';

const MarketMakingPage: FC = () => {
  const currentChainId = useCurrentChain();

  if (currentChainId !== RSK_CHAIN_ID) {
    return (
      <CrocContextProvider>
        <AmbientMarketMaking />
      </CrocContextProvider>
    );
  }
  return <MarketMaking />;
};

export default MarketMakingPage;
