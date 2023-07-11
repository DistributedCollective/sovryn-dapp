import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  TOKEN_RENDER_PRECISION,
  VP,
} from '../../../../../../constants/currencies';
import { translations } from '../../../../../../locales/i18n';
import { fromWei } from '../../../../../../utils/math';
import { useGetStakingBalanceOf } from '../../../hooks/useGetStakingBalanceOf';
import { useGetVotingPower } from '../../../hooks/useGetVotingPower';
import { Vesting } from '../VestingStakesFrame.types';
import { useGetVestingStakeStartEndDates } from '../hooks/useGetVestingStakeStartEndDates';

export const VotingPowerCellRenderer: FC<Vesting> = ({ vestingContract }) => {
  const { balance } = useGetStakingBalanceOf(vestingContract);
  const { endDate } = useGetVestingStakeStartEndDates(vestingContract);
  const votingPower = useGetVotingPower(fromWei(balance), Number(endDate));

  const renderVotingPower = useMemo(() => {
    if (!votingPower) {
      return t(translations.common.na);
    }

    return (
      <AmountRenderer
        value={votingPower}
        suffix={VP}
        precision={TOKEN_RENDER_PRECISION}
        showRoundingPrefix
        dataAttribute="vesting-stake-voting-power-amount"
      />
    );
  }, [votingPower]);

  return <>{renderVotingPower}</>;
};
