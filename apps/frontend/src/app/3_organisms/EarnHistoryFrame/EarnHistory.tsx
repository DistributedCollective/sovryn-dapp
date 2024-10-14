import React, { FC, useMemo, useState } from 'react';

import { ChainIds } from '@sovryn/ethers-provider';
import { Select } from '@sovryn/ui';

import { useCurrentChain } from '../../../hooks/useChainStore';
import { isBobChain } from '../../../utils/chain';
import { EARN_HISTORY_OPTIONS } from './EarnHistory.constants';
import { EarnHistoryType } from './EarnHistory.types';
import { AaveLendingHistoryFrame } from './components/AaveLendingHistoryFrame/AaveLendingHistoryFrame';
import { AmbientMarketMakingHistoryFrame } from './components/AmbientMarketMakingHistoryFrame/AmbientMarketMakingHistoryFrame';
import { LendingHistoryFrame } from './components/LendingHistoryFrame/LendingHistoryFrame';
import { MarketMakingHistoryFrame } from './components/MarketMakingHistoryFrame/MarketMakingHistoryFrame';
import { StabilityPoolHistoryFrame } from './components/StabilityPoolHistoryFrame/StabilityPoolHistoryFrame';

export const EarnHistory: FC = () => {
  const chainId = useCurrentChain();
  const [selectedHistoryType, setSelectedHistoryType] = useState(
    EARN_HISTORY_OPTIONS(isBobChain(chainId))[0].value,
  );

  const SelectComponent = useMemo(
    () => (
      <Select
        dataAttribute={`earn-history-${selectedHistoryType}`}
        value={selectedHistoryType}
        onChange={setSelectedHistoryType}
        options={EARN_HISTORY_OPTIONS(isBobChain(chainId))}
        className="min-w-36 w-full lg:w-auto"
      />
    ),
    [selectedHistoryType, chainId],
  );

  const HistoryFrame = useMemo(() => {
    if (chainId === ChainIds.SEPOLIA) {
      return <AmbientMarketMakingHistoryFrame />;
    }

    switch (selectedHistoryType) {
      case EarnHistoryType.stabilityPool:
        return isBobChain(chainId) ? null : (
          <StabilityPoolHistoryFrame>
            {SelectComponent}
          </StabilityPoolHistoryFrame>
        );
      case EarnHistoryType.lending:
        return isBobChain(chainId) ? (
          <AaveLendingHistoryFrame>{SelectComponent}</AaveLendingHistoryFrame>
        ) : (
          <LendingHistoryFrame>{SelectComponent}</LendingHistoryFrame>
        );
      case EarnHistoryType.marketMaking:
        return isBobChain(chainId) ? (
          <AmbientMarketMakingHistoryFrame>
            {SelectComponent}
          </AmbientMarketMakingHistoryFrame>
        ) : (
          <MarketMakingHistoryFrame>{SelectComponent}</MarketMakingHistoryFrame>
        );
    }
  }, [SelectComponent, chainId, selectedHistoryType]);

  return <>{HistoryFrame}</>;
};
