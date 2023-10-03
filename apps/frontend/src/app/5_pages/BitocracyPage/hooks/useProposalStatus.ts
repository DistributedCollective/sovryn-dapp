import { useMemo } from 'react';

import { Decimal } from '@sovryn/utils';

import { MS } from '../../../../constants/general';
import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { Proposal } from '../../../../utils/graphql/rsk/generated';
import { decimalic } from '../../../../utils/math';
import { ProposalState } from '../BitocracyPage.types';
import { GRACE_PERIOD_IN_SECONDS } from '../components/Proposals/Proposals.constants';

export const useProposalStatus = (proposal?: Proposal) => {
  const { value: blockNumber } = useBlockNumber();
  const currentTimeStamp = useMemo(() => Math.ceil(Date.now() / MS), []);

  return useMemo(() => {
    if (!proposal) {
      return ProposalState.Pending;
    }

    let status: ProposalState;

    const totalVotes = Decimal.fromBigNumberString(proposal.votesFor).add(
      Decimal.fromBigNumberString(proposal.votesAgainst),
    );

    const supportPercentage = Decimal.fromBigNumberString(proposal.votesFor)
      .div(totalVotes)
      .mul(100);

    if (proposal.canceled) {
      status = ProposalState.Canceled;
    } else if (blockNumber <= proposal.endBlock) {
      status = ProposalState.Active;
    } else if (blockNumber <= proposal.startBlock) {
      status = ProposalState.Pending;
    } else if (
      supportPercentage.lte(proposal.emittedBy.majorityPercentageVotes) ||
      decimalic(totalVotes).lt(Decimal.fromBigNumberString(proposal.quorum))
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

    return status;
  }, [blockNumber, currentTimeStamp, proposal]);
};
