import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import {
  ProposalProps,
  ProposalState,
} from '../../5_pages/BitocracyPage/BitocracyPage.types';
import { useProposalStatus } from '../../5_pages/BitocracyPage/hooks/useProposalStatus';
import { VP } from '../../5_pages/StakePage/StakePage.constants';
import { useGetPersonalStakingStatistics } from '../../5_pages/StakePage/components/PersonalStakingStatistics/hooks/useGetPersonalStakingStatistics';
import { useGetStakingStatistics } from '../../5_pages/StakePage/components/StakingStatistics/hooks/useGetStakingStatistics';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { decimalic, fromWei } from '../../../utils/math';
import { LabeledAmount } from './ProposalVotingPower.utils';

export const ProposalVotingPower: FC<ProposalProps> = ({ proposal }) => {
  const { account } = useAccount();
  const { votingPower } = useGetPersonalStakingStatistics();
  const { totalVotingPower } = useGetStakingStatistics();

  const status = useProposalStatus(proposal);

  const isVotingPowerVisible = useMemo(
    () => status === ProposalState.Active,
    [status],
  );

  const votingPowerShare = useMemo(() => {
    if (!votingPower || !totalVotingPower) {
      return 0;
    }
    const votingPowerDecimal = decimalic(votingPower.toString());
    const totalVotingPowerDecimal = decimalic(totalVotingPower.toString());
    const getVotingPowerShare = votingPowerDecimal
      .div(totalVotingPowerDecimal)
      .mul(100);
    return getVotingPowerShare.toNumber();
  }, [votingPower, totalVotingPower]);

  return isVotingPowerVisible ? (
    <div className="bg-gray-90 rounded mb-6 p-6">
      <Paragraph size={ParagraphSize.base} className="font-medium mb-6">
        {t(translations.proposalVotingPower.title)}
      </Paragraph>

      <div className="flex items-center">
        <LabeledAmount
          label={translations.proposalVotingPower.votingPower}
          amount={account ? fromWei(votingPower) : undefined}
          amountSuffix={VP}
        />
        <LabeledAmount
          label={translations.proposalVotingPower.votingPowerShare}
          amount={account ? votingPowerShare : undefined}
          amountSuffix="%"
          precision={5}
        />
      </div>
    </div>
  ) : null;
};
