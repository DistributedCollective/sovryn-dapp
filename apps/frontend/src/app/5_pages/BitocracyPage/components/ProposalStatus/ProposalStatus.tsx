import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Paragraph } from '@sovryn/ui';

import { MS } from '../../../../../constants/general';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { decimalic } from '../../../../../utils/math';
import { ProposalProps, ProposalState } from '../../BitocracyPage.types';
import { GRACE_PERIOD_IN_SECONDS } from '../Proposals/Proposals.constants';
import { getStatusIcon } from '../Proposals/Proposals.utils';

export const ProposalStatus: FC<ProposalProps> = ({ proposal }) => {
  const { value: blockNumber } = useBlockNumber();
  const currentTimeStamp = useMemo(() => Math.ceil(Date.now() / MS), []);

  const totalVotes = useMemo(
    () => decimalic(proposal.votesFor).add(proposal.votesAgainst),
    [proposal.votesFor, proposal.votesAgainst],
  );
  const totalVotesMajorityPercentage = useMemo(
    () => totalVotes.div(100).mul(proposal.majorityPercentage),
    [totalVotes, proposal.majorityPercentage],
  );

  const isActiveProposal = useMemo(
    () => blockNumber <= proposal.endBlock,
    [blockNumber, proposal.endBlock],
  );

  let status: ProposalState;

  if (proposal.canceled) {
    status = ProposalState.Canceled;
  } else if (blockNumber <= proposal.endBlock) {
    status = ProposalState.Active;
  } else if (blockNumber <= proposal.startBlock) {
    status = ProposalState.Pending;
  } else if (
    decimalic(proposal.votesFor).lte(totalVotesMajorityPercentage) ||
    decimalic(totalVotes).lt(proposal.quorum)
  ) {
    status = ProposalState.Defeated;
  } else if (proposal.eta === 0) {
    status = ProposalState.Succeeded;
  } else if (proposal.executed) {
    status = ProposalState.Executed;
  } else if (
    proposal.eta &&
    currentTimeStamp >= proposal.eta + GRACE_PERIOD_IN_SECONDS
  ) {
    status = ProposalState.Expired;
  } else {
    status = ProposalState.Queued;
  }

  return (
    <div className="flex items-center">
      {getStatusIcon(status)}
      <Paragraph
        className={`${!isActiveProposal && 'text-gray-40'} font-semibold`}
        children={t(
          translations.bitocracyPage.proposalStatus[
            ProposalState[status].toLowerCase()
          ],
        )}
      />
    </div>
  );
};
