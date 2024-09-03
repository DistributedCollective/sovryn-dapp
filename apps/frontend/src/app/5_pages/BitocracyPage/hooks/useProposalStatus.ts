import { useMemo } from 'react';

import { MS } from '../../../../constants/general';
import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import { Proposal } from '../../../../utils/graphql/rsk/generated';
import { ProposalState } from '../BitocracyPage.types';
import { shouldProposalBeDefeated } from '../BitocracyPage.utils';
import { GRACE_PERIOD_IN_SECONDS } from '../components/Proposals/Proposals.constants';

export const useProposalStatus = (proposal?: Proposal, block?: number) => {
  const { value: blockNumber } = useBlockNumber();
  const currentTimeStamp = useMemo(() => Math.ceil(Date.now() / MS), []);

  return useMemo(() => {
    if (!proposal) {
      return ProposalState.Pending;
    }

    let status: ProposalState;

    if (proposal.canceled) {
      status = ProposalState.Canceled;
    } else if ((block || blockNumber) <= proposal.endBlock) {
      status = ProposalState.Active;
    } else if ((block || blockNumber) <= proposal.startBlock) {
      status = ProposalState.Pending;
    } else if (shouldProposalBeDefeated(proposal)) {
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
  }, [blockNumber, block, currentTimeStamp, proposal]);
};
