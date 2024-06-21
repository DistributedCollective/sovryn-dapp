import React, { FC, useMemo, useState } from 'react';

import { ChainIds } from '@sovryn/ethers-provider';
import { Select } from '@sovryn/ui';

import { useCurrentChain } from '../../../hooks/useChainStore';
import { isBobChain, isRskChain } from '../../../utils/chain';
import { EARN_HISTORY_OPTIONS } from './EarnHistory.constants';
import { EarnHistoryType } from './EarnHistory.types';
import { AmbientMarketMakingHistoryFrame } from './components/AmbientMarketMakingHistoryFrame/AmbientMarketMakingHistoryFrame';
import { LendingHistoryFrame } from './components/LendingHistoryFrame/LendingHistoryFrame';
import { MarketMakingHistoryFrame } from './components/MarketMakingHistoryFrame/MarketMakingHistoryFrame';
import { StabilityPoolHistoryFrame } from './components/StabilityPoolHistoryFrame/StabilityPoolHistoryFrame';

export const EarnHistory: FC = () => {
  const chainId = useCurrentChain();
  const [selectedHistoryType, setSelectedHistoryType] = useState(
    EarnHistoryType.stabilityPool,
  );

  const SelectComponent = useMemo(
    () => (
      <Select
        dataAttribute={`earn-history-${selectedHistoryType}`}
        value={selectedHistoryType}
        onChange={setSelectedHistoryType}
        options={EARN_HISTORY_OPTIONS}
        className="min-w-36 w-full lg:w-auto"
      />
    ),
    [selectedHistoryType],
  );

  const HistoryFrame = useMemo(() => {
    if (isBobChain(chainId) || chainId === ChainIds.SEPOLIA) {
      return <AmbientMarketMakingHistoryFrame />;
    } else if (isRskChain(chainId)) {
      switch (selectedHistoryType) {
        case EarnHistoryType.stabilityPool:
          return (
            <>
              <StabilityPoolHistoryFrame>
                {SelectComponent}
              </StabilityPoolHistoryFrame>
            </>
          );
        case EarnHistoryType.lending:
          return (
            <>
              <LendingHistoryFrame>{SelectComponent}</LendingHistoryFrame>
            </>
          );

        case EarnHistoryType.marketMaking:
          return (
            <MarketMakingHistoryFrame>
              {SelectComponent}
            </MarketMakingHistoryFrame>
          );
      }
    } else {
      return null;
    }
  }, [SelectComponent, chainId, selectedHistoryType]);

  return <>{HistoryFrame}</>;
};
