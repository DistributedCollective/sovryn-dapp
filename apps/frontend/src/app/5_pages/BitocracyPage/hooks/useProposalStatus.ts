import { useMemo } from 'react';

import { MS } from '../../../../constants/general';
import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { Proposal } from '../../../../utils/graphql/rsk/generated';
import { decimalic } from '../../../../utils/math';
import { ProposalState } from '../BitocracyPage.types';
import { GRACE_PERIOD_IN_SECONDS } from '../components/Proposals/Proposals.constants';

export const useProposalStatus = (proposal: Proposal) => {
  const { value: blockNumber } = useBlockNumber();
  const currentTimeStamp = useMemo(() => Math.ceil(Date.now() / MS), []);

  const totalVotes = useMemo(
    () => decimalic(proposal.votesFor).add(proposal.votesAgainst),
    [proposal.votesFor, proposal.votesAgainst],
  );

  return useMemo(() => {
    let status: ProposalState;

    if (proposal.canceled) {
      status = ProposalState.Canceled;
    } else if (blockNumber <= proposal.endBlock) {
      status = ProposalState.Active;
    } else if (blockNumber <= proposal.startBlock) {
      status = ProposalState.Pending;
    } else if (
      decimalic(proposal.votesFor).lte(proposal.majorityPercentage) ||
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

    return status;
  }, [
    blockNumber,
    currentTimeStamp,
    proposal.canceled,
    proposal.endBlock,
    proposal.eta,
    proposal.executed,
    proposal.quorum,
    proposal.startBlock,
    proposal.votesFor,
    proposal.majorityPercentage,
    totalVotes,
  ]);
};
