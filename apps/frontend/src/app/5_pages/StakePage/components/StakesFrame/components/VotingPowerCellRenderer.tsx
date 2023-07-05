import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  TOKEN_RENDER_PRECISION,
  VP,
} from '../../../../../../constants/currencies';
import { StakingType } from '../StakesFrame.types';
import { useGetVotingPower } from '../hooks/useGetVotingPower';

export const VotingPowerCellRenderer: FC<StakingType> = ({
  amount,
  lockedUntil,
}) => {
  const votingPower = useGetVotingPower(amount, lockedUntil);
  return (
    <AmountRenderer
      value={votingPower}
      suffix={VP}
      precision={TOKEN_RENDER_PRECISION}
      showRoundingPrefix
      dataAttribute="stake-voting-power-amount"
    />
  );
};
