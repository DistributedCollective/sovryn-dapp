import React, { FC } from 'react';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { useCurrentChain } from '../../../hooks/useChainStore';
import { AmbientMarketMaking } from './components/AmbientMarketMaking/AmbientMarketMaking';
import { MarketMaking } from './components/MarketMaking/MarketMaking';

const MarketMakingPage: FC = () => {
  const currentChainId = useCurrentChain();

  if (currentChainId === BOB_CHAIN_ID) {
    return <AmbientMarketMaking />;
  }
  return <MarketMaking />;
};

export default MarketMakingPage;
