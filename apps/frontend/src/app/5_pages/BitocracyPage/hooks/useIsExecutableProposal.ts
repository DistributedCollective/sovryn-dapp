import { useMemo } from 'react';

import { useGetTokenContract } from '../../../../hooks/useGetContract';
import { COMMON_SYMBOLS } from '../../../../utils/asset';
import { Proposal } from '../../../../utils/graphql/rsk/generated';
import { SIGNATURE_SYMBOLS } from '../components/Proposals/Proposals.constants';

export const useIsExecutableProposal = (proposal: Proposal) => {
  const sovContract = useGetTokenContract(COMMON_SYMBOLS.SOV);

  const isExecutableProposal = useMemo(() => {
    if (
      proposal.targets.length === 1 &&
      proposal.targets[0] === sovContract?.address &&
      SIGNATURE_SYMBOLS.includes(proposal.signatures[0])
    ) {
      return false;
    } else {
      return true;
    }
  }, [proposal.signatures, proposal.targets, sovContract?.address]);

  return isExecutableProposal;
};
