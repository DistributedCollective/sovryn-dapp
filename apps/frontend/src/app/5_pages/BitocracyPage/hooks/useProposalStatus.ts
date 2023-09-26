import { useMemo } from 'react';

import { MS } from '../../../../constants/general';
import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { Proposal } from '../../../../utils/graphql/rsk/generated';
import { decimalic } from '../../../../utils/math';
import { ProposalState } from '../BitocracyPage.types';
import { GRACE_PERIOD_IN_SECONDS } from '../components/Proposals/Proposals.constants';

export const useProposalStatus = (proposal?: Proposal) => {
  const { value: blockNumber } = useBlockNumber();
  const currentTimeStamp = useMemo(() => Math.ceil(Date.now() / MS), []);

  const totalVotes = useMemo(
    () => decimalic(proposal?.votesFor).add(proposal?.votesAgainst || 0),
    [proposal],
  );
  const totalVotesMajorityPercentage = useMemo(
    () => totalVotes.div(100).mul(proposal?.majorityPercentage || 0),
    [totalVotes, proposal],
  );

  return useMemo(() => {
    let status: ProposalState;

    if (!proposal) {
      status = ProposalState.Pending;
    } else if (proposal.canceled) {
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

    return status;
  }, [
    blockNumber,
    currentTimeStamp,
    proposal,
    totalVotes,
    totalVotesMajorityPercentage,
  ]);
};
