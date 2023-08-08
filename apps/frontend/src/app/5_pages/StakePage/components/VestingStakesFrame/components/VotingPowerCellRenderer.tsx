import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../constants/currencies';
import { translations } from '../../../../../../locales/i18n';
import { fromWei } from '../../../../../../utils/math';
import { VP } from '../../../StakePage.constants';
import { useGetVestingStakeVotingPower } from '../../StakesFrame/hooks/useGetVestingStakeVotingPower';
import { VestingContractTableRecord } from '../VestingStakesFrame.types';

export const VotingPowerCellRenderer: FC<VestingContractTableRecord> = ({
  address,
}) => {
  const votingPower = useGetVestingStakeVotingPower(address);

  const renderVotingPower = useMemo(() => {
    if (!votingPower) {
      return t(translations.common.na);
    }

    return (
      <AmountRenderer
        value={fromWei(votingPower)}
        suffix={VP}
        precision={TOKEN_RENDER_PRECISION}
        showRoundingPrefix
        dataAttribute="vesting-stake-voting-power-amount"
      />
    );
  }, [votingPower]);

  return <>{renderVotingPower}</>;
};
