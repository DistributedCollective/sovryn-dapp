import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../constants/currencies';
import { translations } from '../../../../../../locales/i18n';
import { VP } from '../../../StakePage.constants';
import { useGetVotingPower } from '../../../hooks/useGetVotingPower';
import { StakeItem } from '../StakesFrame.types';

export const VotingPowerCellRenderer: FC<StakeItem> = ({
  stakedAmount,
  unlockDate,
}) => {
  const votingPower = useGetVotingPower(stakedAmount, unlockDate);

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
        dataAttribute="stake-voting-power-amount"
      />
    );
  }, [votingPower]);

  return <>{renderVotingPower}</>;
};
