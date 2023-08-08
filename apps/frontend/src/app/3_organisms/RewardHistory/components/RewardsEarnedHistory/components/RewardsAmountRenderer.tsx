import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../constants/tokens';
import { useTokenDetailsByAddress } from '../../../../../../hooks/useTokenDetailsByAddress';
import { RewardsEarnedHistoryItem } from '../../../../../../utils/graphql/rsk/generated';
import { decimalic } from '../../../../../../utils/math';

export const RewardsAmountRenderer: FC<RewardsEarnedHistoryItem> = tx => {
  const token = useTokenDetailsByAddress(tx.token?.toLowerCase());
  return (
    <AmountRenderer
      value={decimalic(tx.amount).toString()}
      suffix={getTokenDisplayName(token?.symbol || '')}
      precision={TOKEN_RENDER_PRECISION}
      dataAttribute="reward-earned-history-amount"
    />
  );
};
