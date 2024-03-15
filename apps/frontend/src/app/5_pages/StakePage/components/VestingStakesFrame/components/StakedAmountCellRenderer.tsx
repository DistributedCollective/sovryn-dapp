import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../constants/currencies';
import { fromWei } from '../../../../../../utils/math';
import { useGetStakingBalanceOf } from '../../../hooks/useGetStakingBalanceOf';
import { COMMON_SYMBOLS, normalizeAsset } from '../../../../../../utils/asset';
import { RSK_CHAIN_ID } from '../../../../../../config/chains';

type StakedAmountCellRendererProps = {
  vestingContract: string;
};

export const StakedAmountCellRenderer: FC<StakedAmountCellRendererProps> = ({
  vestingContract,
}) => {
  const { balance } = useGetStakingBalanceOf(vestingContract);

  return (
    <AmountRenderer
      value={fromWei(balance)}
      suffix={normalizeAsset(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID).symbol}
      precision={TOKEN_RENDER_PRECISION}
      showRoundingPrefix
      dataAttribute="vesting-stakes-amount"
    />
  );
};
