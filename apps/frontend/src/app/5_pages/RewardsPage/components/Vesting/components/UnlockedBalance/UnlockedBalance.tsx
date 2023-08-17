import React from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  SOV,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';
import { VestingContractTableRecord } from '../../Vesting.types';
import { useGetUnlockedBalance } from '../../hooks/useGetUnlockedBalance';

export const UnlockedBalance = (item: VestingContractTableRecord) => {
  const { isLoading, result } = useGetUnlockedBalance(item);

  if (isLoading) {
    return <span>{t(translations.rewardPage.vesting.table.calculating)}</span>;
  }

  return (
    <AmountRenderer
      value={result}
      suffix={SOV}
      precision={TOKEN_RENDER_PRECISION}
      dataAttribute="vesting-rewards-unlocked-balance"
    />
  );
};
