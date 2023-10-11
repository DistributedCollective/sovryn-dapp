import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useGetTokenContract } from '../../../../hooks/useGetContract';
import { Proposal } from '../../../../utils/graphql/rsk/generated';
import { SIGNATURE_SYMBOL } from '../components/Proposals/Proposals.constants';

export const useIsExecutableProposal = (proposal: Proposal) => {
  const sovContract = useGetTokenContract(SupportedTokens.sov);

  const isExecutableProposal = useMemo(() => {
    if (
      proposal.targets.length === 1 &&
      proposal.targets[0] === sovContract?.address &&
      proposal.signatures[0] === SIGNATURE_SYMBOL
    ) {
      return false;
    } else {
      return true;
    }
  }, [proposal.signatures, proposal.targets, sovContract?.address]);

  return isExecutableProposal;
};
