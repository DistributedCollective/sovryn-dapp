import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { getAssetData } from '@sovryn/contracts';
import { Select } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../../../../config/chains';

import { useAaveBorrow } from '../../../../../../../hooks/aave/useAaveBorrow';
import { translations } from '../../../../../../../locales/i18n';
import { BorrowRateMode } from '../../../../../../../types/aave';
import { BorrowPosition } from '../../BorrowPositionsList.types';

type BorrowRateModeSelectProps = {
  position: BorrowPosition;
};

export const BorrowRateModeSelect: FC<BorrowRateModeSelectProps> = ({
  position,
}) => {
  const { handleSwapBorrowRateMode } = useAaveBorrow();

  const options = useMemo(() => {
    const borrowRateModeOptions = [
      {
        label: t(translations.aavePage.borrowPositionsList.selectVariableApy, {
          apy: position.variableApy.toString(2),
        }),
        value: String(BorrowRateMode.VARIABLE),
      },
    ];

    if (
      // cannot be collateral for stable borrows
      (position.stableBorrowEnabled && !position.isCollateral) ||
      position.borrowRateMode === BorrowRateMode.STABLE
    ) {
      borrowRateModeOptions.push({
        label: t(translations.aavePage.borrowPositionsList.selectStableApy, {
          apy: position.stableApy.toString(2),
        }),
        value: String(BorrowRateMode.STABLE),
      });
    }
    return borrowRateModeOptions;
  }, [position]);

  const onRateModeChange = useCallback(
    async (rateMode: string) => {
      handleSwapBorrowRateMode(
        await getAssetData(position.asset, BOB_CHAIN_ID),
        position.borrowRateMode,
      );
    },
    [handleSwapBorrowRateMode, position],
  );

  return (
    <Select
      onChange={onRateModeChange}
      options={options}
      value={position.borrowRateMode.toString()}
    />
  );
};
