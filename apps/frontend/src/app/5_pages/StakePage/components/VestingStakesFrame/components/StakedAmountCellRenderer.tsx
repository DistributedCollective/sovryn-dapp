import React, { FC } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../constants/currencies';
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
      suffix={SupportedTokens.sov}
      precision={TOKEN_RENDER_PRECISION}
      showRoundingPrefix
      dataAttribute="vesting-stakes-amount"
    />
  );
};
