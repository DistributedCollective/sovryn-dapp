import React, { FC } from 'react';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../constants/currencies';
import { COMMON_SYMBOLS, findAsset } from '../../../../../../utils/asset';
import { fromWei } from '../../../../../../utils/math';
import { useGetStakingBalanceOf } from '../../../hooks/useGetStakingBalanceOf';

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
      suffix={findAsset(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID).symbol}
      precision={TOKEN_RENDER_PRECISION}
      showRoundingPrefix
      dataAttribute="vesting-stakes-amount"
    />
  );
};
