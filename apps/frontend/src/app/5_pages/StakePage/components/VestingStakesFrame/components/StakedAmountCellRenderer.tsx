import React, { FC } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../constants/currencies';
import { VestingContractTableRecord } from '../VestingStakesFrame.types';

export const StakedAmountCellRenderer: FC<VestingContractTableRecord> = ({
  currentBalance,
}) => {
  return (
    <AmountRenderer
      value={currentBalance}
      suffix={SupportedTokens.sov}
      precision={TOKEN_RENDER_PRECISION}
      showRoundingPrefix
      dataAttribute="vesting-stakes-amount"
    />
  );
};
